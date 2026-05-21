const PostUserUseCase =
require('../../../Back/src/application/usecase/users/postUserUseCase');

describe('createUserUseCase',()=>{

    let userRepository;
    let hashingService;
    let useCase;

    beforeEach(()=>{

        userRepository = {
            postUser:jest.fn()
        };

        hashingService = {
            hash:jest.fn()
        };

        useCase = new PostUserUseCase(
            userRepository,
            hashingService
        );
    });

    const validPayload = () => ({
        userName:'juan123',
        firstName:'Juan',
        lastnameP:'Perez',
        lastnameM:'Lopez',
        birthdate:'01/01/2000',
        password:'123456',
        assigned:'clinic-001',
        phase:'Protésico',
        basePathology:'Diabetes',
        otherPathology:null,
        modality:'Presencial',
        profilePhoto:null,
        referenceNumber:'REF001',
        amputationDate:'01/01/2023',
        amputationLevel:'Rodilla',
        otherLevel:null,
        laterality:'Diestra',
        prosthetist:'Carlos',
        neuroEntryDate:'01/01/2024',
        pairs:'Sí asiste',
        sex:'Masculino'
    });

    test('creates a new user successfully',async()=>{

        hashingService.hash.mockResolvedValue('hashedPassword');

        userRepository.postUser.mockResolvedValue({idUser:'u-001'});

        const result = await useCase.execute(validPayload());

        expect(hashingService.hash).toHaveBeenCalledWith('123456');

        expect(userRepository.postUser).toHaveBeenCalled();

        expect(result).toBeDefined();
    });

    test('throws error when required fields are missing',async()=>{

        const invalid = validPayload();

        invalid.basePathology ='';

        await expect(useCase.execute(invalid)
        ).rejects.toThrow('La etiología de amputación debe llenarse');
    });

    test('throws error when user already exists',async()=>{

        hashingService.hash.mockResolvedValue('hashedPassword');

        userRepository.postUser.mockRejectedValue(
            new Error(
                'Usuario duplicado'
            )
        );

        await expect(useCase.execute(validPayload())
        ).rejects.toThrow('Usuario duplicado');
    });

});