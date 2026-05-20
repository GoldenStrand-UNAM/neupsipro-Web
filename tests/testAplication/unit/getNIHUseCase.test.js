const getNIHResultUseCase = require('../../../Back/src/application/usecase/testApplications/getNIHUseCase');

describe('getNIHResultUseCase — Unit Tests', () => {
    let mockResultsRepository;
    let useCase;

    const sampleRow = {
        id_results: 'r-001',
        status: 3,
        date_applied: '2026-05-19',
        notes: 'Notas clínicas registradas',
    };
    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = { fetchNIHResult: jest.fn() };
        useCase = new getNIHResultUseCase(mockResultsRepository);
    });

    test('throws 404 if the NIH result is not found', async () => {
        mockResultsRepository.fetchNIHResult.mockResolvedValue(null);

        await expect(useCase.execute({ id_results: 'r-001' }))
            .rejects.toMatchObject({ status: 404, message: 'NIH result not found' });
    });

    test('calls fetchNIHResult with id_results from the request', async () => {
        mockResultsRepository.fetchNIHResult.mockResolvedValue(sampleRow);

        await useCase.execute({ id_results: 'r-001' });

        expect(mockResultsRepository.fetchNIHResult).toHaveBeenCalledWith({ id_results: 'r-001' });
    });

    test('maps a populated row to a DTO with notes', async () => {
        mockResultsRepository.fetchNIHResult.mockResolvedValue(sampleRow);

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(5);
        expect(dto.status).toBe(3);
        expect(dto.dateApplied).toBe('2026-05-19');
        expect(dto.notes).toBe('Notas clínicas registradas');
    });

    test('defaults dateApplied and notes to null when absent', async () => {
        mockResultsRepository.fetchNIHResult.mockResolvedValue({
            id_results: 'r-001',
            status: 1,
        });

        const dto = await useCase.execute({ id_results: 'r-001' });
        expect(dto.dateApplied).toBeNull();
        expect(dto.notes).toBeNull();
        expect(dto.status).toBe(1);
    });

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchNIHResult.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ id_results: 'r-001' })).rejects.toThrow('DB error');
    });
});