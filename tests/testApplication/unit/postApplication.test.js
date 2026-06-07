const postApplicationUseCase = require('../../../Back/src/application/usecase/testApplications/postApplicationUseCase');
const testApplicationDTO = require('../../../Back/src/application/dto/testApplicationDTO');

describe('postApplicationUseCase — Unit Tests', () => {
    let mockAppRepo;
    let mockResultsRepo;
    let useCase;

    const validInput = {
        id_user: 'user-001',
        application_name: 'Evaluación 0',
    };

    const fakeProtocolTests = [
        { id_test: 1, test_name: 'BANFE', result_table: 'banfe_results' },
        { id_test: 2, test_name: 'WAIS',  result_table: 'wais_results'  },
        { id_test: 5, test_name: 'NIH',   result_table: 'nih_results'   },
    ];

    // Shape returned by saveApplication, used by happy-path tests
    const savedEntity = {
        idApplication: 'app-001',
        idUser: 'user-001',
        applicationName: 'Evaluación 0',
        status: 'Por comenzar',
        createdAt: '2026-05-19',
        _rawStatus: 1,
    };

    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockAppRepo = {
            fetchUserProtocol: jest.fn(),
            fetchTestApplications: jest.fn().mockResolvedValue([]),
            fetchProtocolTests: jest.fn(),
            saveApplication: jest.fn(),
        };
        mockResultsRepo = {
            createResults: jest.fn().mockResolvedValue(),
        };
        useCase = new postApplicationUseCase(mockAppRepo, mockResultsRepo);

        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('throws 404 if the user is not found', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue(null);

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 404, message: 'User not found' });

        expect(mockAppRepo.fetchProtocolTests).not.toHaveBeenCalled();
        expect(mockAppRepo.saveApplication).not.toHaveBeenCalled();
    });

    test('throws 422 if the user has protocol "Pending"', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Pending' });

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 422, message: 'User has no valid protocol assigned' });
    });

    test('throws 422 if the protocol is null', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: null });

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 422 });
    });

    test('throws 422 if application_name is missing', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });

        await expect(useCase.execute({ ...validInput, application_name: undefined }))
            .rejects.toMatchObject({ status: 422, message: 'Nombre de aplicación no válido' });
    });

    test('throws 422 if application_name is only whitespace', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });

        await expect(useCase.execute({ ...validInput, application_name: '   ' }))
            .rejects.toMatchObject({ status: 422, message: 'Nombre de aplicación no válido' });
    });

    test('throws 422 if application_name is not in the allowed list', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });

        await expect(useCase.execute({ ...validInput, application_name: 'nombre inventado' }))
            .rejects.toMatchObject({ status: 422, message: 'Nombre de aplicación no válido' });
    });

    test('accepts every allowed application name', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });
        mockAppRepo.fetchProtocolTests.mockResolvedValue(fakeProtocolTests);

        for (let i = 0; i <= 9; i++) {
            const name = `Evaluación ${i}`;
            mockAppRepo.saveApplication.mockResolvedValue({ ...savedEntity, applicationName: name });

            await expect(useCase.execute({ ...validInput, application_name: name }))
                .resolves.toBeDefined();
        }
    });


    test('throws 422 if the protocol has no tests assigned', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });
        mockAppRepo.fetchProtocolTests.mockResolvedValue([]);

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 422, message: 'No tests found for protocol: Research' });

        expect(mockAppRepo.saveApplication).not.toHaveBeenCalled();
    });

    // happy path
    test('saves the application and creates result rows for every protocol test', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });
        mockAppRepo.fetchProtocolTests.mockResolvedValue(fakeProtocolTests);
        mockAppRepo.saveApplication.mockResolvedValue(savedEntity);

        // Execute use case
        const dto = await useCase.execute(validInput);

        // Verify persistence layer interaction
        expect(mockAppRepo.saveApplication).toHaveBeenCalledWith({
            id_user: 'user-001',
            application_name: 'Evaluación 0',
        });

        expect(mockResultsRepo.createResults).toHaveBeenCalledWith(
            'app-001',
            'user-001',
            [1, 2, 5],
        );

        // 3) DTO returned — never raw entity
        expect(dto).toBeInstanceOf(testApplicationDTO);
        expect(dto.idApplication).toBe('app-001');
        expect(dto.applicationName).toBe('Evaluación 0');
    });

   
    test('orchestrates calls in the correct order', async () => {
        const callOrder = [];

        mockAppRepo.fetchUserProtocol.mockImplementation(async () => {
            callOrder.push('fetchUserProtocol');
            return { protocol: 'Research' };
        });
        mockAppRepo.fetchTestApplications.mockImplementation(async () => {
            callOrder.push('fetchTestApplications');
            return [];
        });
        mockAppRepo.fetchProtocolTests.mockImplementation(async () => {
            callOrder.push('fetchProtocolTests');
            return fakeProtocolTests;
        });
        mockAppRepo.saveApplication.mockImplementation(async () => {
            callOrder.push('saveApplication');
            return savedEntity;
        });
        mockResultsRepo.createResults.mockImplementation(async () => {
            callOrder.push('createResults');
        });

        await useCase.execute(validInput);

        expect(callOrder).toEqual([
            'fetchUserProtocol',
            'fetchTestApplications',
            'fetchProtocolTests',
            'saveApplication',
            'createResults',
        ]);
    });


    test('propagates repository errors to the caller', async () => {
        mockAppRepo.fetchUserProtocol.mockResolvedValue({ protocol: 'Research' });
        mockAppRepo.fetchProtocolTests.mockRejectedValue(new Error('DB timeout'));

        await expect(useCase.execute(validInput)).rejects.toThrow('DB timeout');
    });
});