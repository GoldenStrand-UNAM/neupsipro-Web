const getREYResultUseCase = require('../../../Back/src/application/usecase/testApplications/getReyUseCase');

describe('getREYResultUseCase — Unit Tests', () => {
    let mockResultsRepository;
    let useCase;

    // Repository row used by happy-path tests
    const sampleRow = {
        id_results: 'r-001',
        status: 3,
        date_applied: '2026-05-19',
        score_rc: 30,  pc_rc: 50,  time_rc: 60,  pc_time_rc: 50,
        score_mcp: 18, pc_mcp: 50, time_mcp: 60, pc_time_mcp: 50,
        score_mlp: 17, pc_mlp: 50, time_mlp: 60, pc_time_mlp: 50,
        notes: 'Memoria visual conservada',
    };
    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = { fetchREYResult: jest.fn() };
        useCase = new getREYResultUseCase(mockResultsRepository);
    });

    test('throws 404 if the REY result is not found', async () => {
        mockResultsRepository.fetchREYResult.mockResolvedValue(null);

        await expect(useCase.execute({ id_results: 'r-001' }))
            .rejects.toMatchObject({ status: 404, message: 'REY result not found' });
    });

    test('calls fetchREYResult with id_results from the request', async () => {
        mockResultsRepository.fetchREYResult.mockResolvedValue(sampleRow);

        await useCase.execute({ id_results: 'r-001' });

        expect(mockResultsRepository.fetchREYResult).toHaveBeenCalledWith({ id_results: 'r-001' });
    });

    test('maps a populated row to a DTO with all 3 sections 4 fields', async () => {
        mockResultsRepository.fetchREYResult.mockResolvedValue(sampleRow);

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(3);
        expect(dto.status).toBe(3);
        expect(dto.dateApplied).toBe('2026-05-19');

        expect(dto.rc).toEqual({ score: 30, pc: 50, time: 60, pcTime: 50 });

        expect(dto.mcp).toEqual({ score: 18, pc: 50, time: 60, pcTime: 50 });

        expect(dto.mlp).toEqual({ score: 17, pc: 50, time: 60, pcTime: 50 });

        expect(dto.notes).toBe('Memoria visual conservada');
    });


    test('defaults every section field to null when the row has them undefined', async () => {
        mockResultsRepository.fetchREYResult.mockResolvedValue({
            id_results: 'r-001',
            status: 1,
            // no scores / times / pcs
        });

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.rc).toEqual({ score: null, pc: null, time: null, pcTime: null });
        expect(dto.mcp).toEqual({ score: null, pc: null, time: null, pcTime: null });
        expect(dto.mlp).toEqual({ score: null, pc: null, time: null, pcTime: null });
        expect(dto.dateApplied).toBeNull();
        expect(dto.notes).toBeNull();
    });

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchREYResult.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ id_results: 'r-001' })).rejects.toThrow('DB error');
    });
});