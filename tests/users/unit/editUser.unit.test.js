const EditUserUseCase = require('../../../Back/src/application/usecase/users/editUserUseCase');
const EditUserController = require('../../../Back/src/presentation/controller/users/editUser.controller');
const User = require('../../../Back/src/domain/entity/user');

jest.mock('../../../Back/src/infrastructure/external/validations', () => {
    return jest.fn().mockImplementation(() => ({
        validate: jest.fn((val) => val),
        validateEnum: jest.fn((val) => val),
        validateDate: jest.fn((val) => val),
        validateEmail: jest.fn((val) => val),
        validatePhone: jest.fn((val) => val),
        validateRefNumber: jest.fn((val) => val), // <--- ¡Esta era la que faltaba!
        others: jest.fn((v1, v2) => v1),
    }));
});

const { deleteFromS3 } = require('../../../Back/src/infrastructure/external/s3.config');
jest.mock('../../../Back/src/infrastructure/external/s3.config', () => ({
    deleteFromS3: jest.fn().mockResolvedValue(true),
}));

describe('EditUserUseCase', () => {
    let mockUserRepository;
    let mockHashingService;
    let useCase;

    const validUserData = {
        id_user: '123',
        userName: 'johndoe',
        firstName: 'John',
        lastnameP: 'Doe',
        birthdate: '01/01/1900',
        sex: 'Masculino',
        password: 'newSecurePassword123',
        profilePhoto: 'new_photo.jpg',
        referenceNumber: '123P-ABC',
        phase:'Preprotésico',
        basePathology: 'Trauma',
        modality: 'En línea',
        pairs: 'Sí asiste',
        assigned: 'clinic-456',
        amputationDate: '05/05/2000',
        amputationLevel: 'Transtibial',
        laterality: 'Diestra',
        prosthetist: 'CPO Juan David Orozco',
    };

    beforeEach(() => {
        jest.clearAllMocks();

        mockUserRepository = {
            fetchUserForEdit: jest.fn(),
            checkDuplicate: jest.fn(),
            editUser: jest.fn(),
        };

        mockHashingService = {
            hash: jest.fn().mockResolvedValue('encrypted_hash_password'),
        };

        useCase = new EditUserUseCase(mockUserRepository, mockHashingService);
    });

    test('Must edit with success if user has all valid data', async () => {
        mockUserRepository.fetchUserForEdit.mockResolvedValue({
            id_user: '123',
            profile_photo: 'old_photo.jpg',
        });
        mockUserRepository.checkDuplicate.mockResolvedValue(null);
        mockUserRepository.editUser.mockResolvedValue({ id_user: '123', success: true});

        const result = await useCase.execute(validUserData);
        
        expect(mockUserRepository.fetchUserForEdit).toHaveBeenCalledWith({ id_user: '123' });
        expect(mockHashingService.hash).toHaveBeenCalledWith('newSecurePassword123');
        expect(mockUserRepository.editUser).toHaveBeenCalled();
        expect(deleteFromS3).toHaveBeenCalledWith('old_photo.jpg');
        expect(result).toEqual({ id_user: '123', success: true });
    });

    test('If password is empty, does not apply hash nor deletes previous one', async () => {
        const dataWithoutPassword = { ...validUserData, password: '' };

        mockUserRepository.fetchUserForEdit.mockResolvedValue({
            id_user:'123',
            profilePhoto: 'old_photo.jpg',
        });
        mockUserRepository.editUser.mockResolvedValue({ id_user: '123' });

        await useCase.execute(dataWithoutPassword);

        expect(mockHashingService.hash).not.toHaveBeenCalled();

        expect(mockUserRepository.editUser).toHaveBeenCalledWith(
            expect.objectContaining({ passwordHash: null })
        );
    });

    test('Must throw 404 error if user does not exist onthe system', async () => {
        mockUserRepository.fetchUserForEdit.mockResolvedValue(null);

        await expect(useCase.execute(validUserData)).rejects.toThrow('Usuario no encontrado');

        expect(mockUserRepository.editUser).not.toHaveBeenCalled();
    });
});

describe('EditUserController', () => {
    let mockEditUserUseCase;
    let controller;
    let req;
    let res;

    beforeEach(() => {
        mockEditUserUseCase = {
            execute: jest.fn(),
        };
        controller = new EditUserController(mockEditUserUseCase);

        req = {
            body: { firstName: 'Juan', userName: 'juan123' },
            params: { id_user: '123' },
            file: null,
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('Must return 200 and the modified user json', async () => {
        mockEditUserUseCase.execute.mockResolvedValue({ id: '123', name: 'Juan' });

        await controller.editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: '123', name: 'Juan' });
    });

    test('Must return 409 status if email or username already exist', async () => {
        const databaseError = new Error('Duplicate entry');
        databaseError.code = 'ER_DUP_ENTRY';

        mockEditUserUseCase.execute.mockRejectedValue(databaseError);

        await controller.editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Usuario duplicado: ya hay un usuario con ese folio o nombre de usuario.',
        });
    });

    test('Must capture domain errors and answer with the corresponding status or 400 by default', async () => {
        const domainError = new Error('Validación fallida');
        domainError.status = 422;

        mockEditUserUseCase.execute.mockRejectedValue(domainError);

        await controller.editUser(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ error: 'Validación fallida' });
    });
});

describe('Domain Entity - User', () => {
    afterEach(() => {
        jest.useRealTimers();
    });

    const mockRawData = {
        id_user: 1,
        profile_photo: 'avatar.png',
        reference_number: 'REF-001',
        first_name: 'Carlos',
        lastname_p: 'Mendoza',
        lastname_m:'Ruiz',
        email: 'carlos@mail.com',
        birthdate: '15/05/1995',
        registration_date: '2026-01-01',
        neuro_status: 'Protésico',
        phone: '5551234567',
    };

    test('Must instansiate the entity correctly joining namesand formatting data where applyable', () => {
        const userEntity = new User(mockRawData);

        expect(userEntity.name).toBe('Carlos Mendoza Ruiz');
        expect(userEntity.idUser).toBe(1);
        expect(userEntity.phase).toBe('Protésico');
    });

    test('Must calculate correctly the birthdate on large text format', () => {
        jest.useFakeTimers().setSystemTime(new Date(2026, 4, 15));

        const userEntity = new User(mockRawData);

        expect(userEntity.age).toBe('31 años, 0 meses y 0 días');

        jest.useRealTimers();
    });

    test('Must return the traduced texts on setProtocol', () => {
        const userEntity = new User(mockRawData);

        expect(userEntity.setProtocol('Clinical')).toBe('Clínico');
        expect(userEntity.setProtocol('research')).toBe('Investigación');
        expect(userEntity.setProtocol(null)).toBeNull();
    });

    test('Must parse and return legible states based on getStatus number', () => {
        const userEntity = new User(mockRawData);

        expect(userEntity.getStatus(1)).toBe('Por comenzar');
        expect(userEntity.getStatus(2)).toBe('En proceso');
        expect(userEntity.getStatus(3)).toBe('Terminada');
        expect(userEntity.getStatus(null)).toBeNull();
    });
});