const getMOCAResultUseCase = require('../../../Back/src/application/usecase/testApplications/getMocaUseCase');

describe('getMOCAResultUseCase — Unit Tests', () => {
    let mockResultsRepository;
    let useCase;

    // Repository row used by successful mapping tests
    const sampleRow = {
        id_results: 'r-001',
        status: 3,
        date_applied: '2026-05-19',
        score: 28,
        interpretation: 'Rendimiento cognitivo normal',
        notes: 'Sin observaciones',
    };
    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = { fetchMocaResult: jest.fn() };
        useCase = new getMOCAResultUseCase(mockResultsRepository);
    });

    test('throws 404 if the MOCA result is not found', async () => {
        mockResultsRepository.fetchMocaResult.mockResolvedValue(null);

        await expect(useCase.execute({ id_results: 'r-001' }))
            .rejects.toMatchObject({ status: 404, message: 'Moca result not found' });
    });

    test('calls fetchMocaResult with id_results from the request', async () => {
        mockResultsRepository.fetchMocaResult.mockResolvedValue(sampleRow);

        await useCase.execute({ id_results: 'r-001' });

        expect(mockResultsRepository.fetchMocaResult).toHaveBeenCalledWith({ id_results: 'r-001' });
    });

    test('maps a populated row to a DTO with score and interpretation', async () => {
        mockResultsRepository.fetchMocaResult.mockResolvedValue(sampleRow);

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(4);
        expect(dto.status).toBe(3);
        expect(dto.dateApplied).toBe('2026-05-19');
        expect(dto.score).toBe(28);
        expect(dto.interpretation).toBe('Rendimiento cognitivo normal');
        expect(dto.notes).toBe('Sin observaciones');
    });

    test('defaults dateApplied and notes to null when absent', async () => {
        mockResultsRepository.fetchMocaResult.mockResolvedValue({
            id_results: 'r-001',
            status: 1,
            score: null,
            interpretation: null,
        });

        const dto = await useCase.execute({ id_results: 'r-001' });
        expect(dto.dateApplied).toBeNull();
        expect(dto.notes).toBeNull();
    });

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchMocaResult.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ id_results: 'r-001' })).rejects.toThrow('DB error');
    });
});