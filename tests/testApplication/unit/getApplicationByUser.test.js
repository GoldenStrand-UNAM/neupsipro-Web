const GetApplicationsByUserUseCase = require('../../../Back/src/application/usecase/testApplications/getApplicationsUseCase');
const testApplicationDTO = require('../../../Back/src/application/dto/testApplicationDTO');

describe('GetApplicationsByUserUseCase — Unit Tests', () => {
    let mockRepository;
    let useCase;

    // Sample session row returned by the repository
    const sampleSession = {
        idApplication: 'app-001',
        idUser: 'user-001',
        applicationName: 'Session A',
        status: 'Por comenzar',
        createdAt: '2026-05-19',
    };

    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockRepository = {
            fetchTestSessions: jest.fn(),
        };
        useCase = new GetApplicationsByUserUseCase(mockRepository);
    });

    test('stores the repository under impTestApplicationsRepository', () => {
        expect(useCase.impTestApplicationsRepository).toBe(mockRepository);
    });

    test('calls fetchTestSessions with the user id', async () => {
        mockRepository.fetchTestSessions.mockResolvedValue([]);

        await useCase.execute({ id_user: 'user-001' });

        expect(mockRepository.fetchTestSessions).toHaveBeenCalledTimes(1);
        expect(mockRepository.fetchTestSessions).toHaveBeenCalledWith({ id_user: 'user-001' });
    });

    test('returns an empty array when the user has no sessions', async () => {
        mockRepository.fetchTestSessions.mockResolvedValue([]);

        const result = await useCase.execute({ id_user: 'user-001' });

        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });

    test('maps each session through testApplicationDTO', async () => {
        mockRepository.fetchTestSessions.mockResolvedValue([
            sampleSession,
            { ...sampleSession, idApplication: 'app-002', applicationName: 'Session B' },
        ]);

        const result = await useCase.execute({ id_user: 'user-001' });

        expect(result).toHaveLength(2);
        result.forEach(item => {
            expect(item).toBeInstanceOf(testApplicationDTO);
        });
    });

    test('preserves the order returned by the repository', async () => {
        const sessions = [
            { ...sampleSession, idApplication: 'app-A' },
            { ...sampleSession, idApplication: 'app-B' },
            { ...sampleSession, idApplication: 'app-C' },
        ];
        mockRepository.fetchTestSessions.mockResolvedValue(sessions);

        const result = await useCase.execute({ id_user: 'user-001' });

        expect(result.map(d => d.idApplication)).toEqual(['app-A', 'app-B', 'app-C']);
    });

    test('propagates repository errors to the caller', async () => {
        mockRepository.fetchTestSessions.mockRejectedValue(new Error('DB connection lost'));

        await expect(useCase.execute({ id_user: 'user-001' }))
            .rejects.toThrow('DB connection lost');
    });
});