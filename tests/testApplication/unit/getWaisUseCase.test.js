const getWAISResultUseCase = require('../../../Back/src/application/usecase/testApplications/getWAISUseCase');

describe('getWAISResultUseCase — Unit Tests', () => {
    let mockResultsRepository;
    let useCase;

    const sampleRow = {
        id_results: 'r-001',
        status: 3,
        date_applied: '2026-05-19',
        score_com_verbal: 100,       inter_com_verbal: 'Promedio',
        score_razon_perceptual: 95,  inter_razon_perceptual: 'Promedio',
        score_mem_work: 105,         inter_mem_work: 'Promedio',
        score_velo_proce: 110,       inter_velo_proce: 'Promedio alto',
        score_total: 410,
        notes: 'CI promedio',
    };
    
    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = { fetchWaisResult: jest.fn() };
        useCase = new getWAISResultUseCase(mockResultsRepository);
    });

    test('throws 404 if the WAIS result is not found', async () => {
        mockResultsRepository.fetchWaisResult.mockResolvedValue(null);

        await expect(useCase.execute({ id_results: 'r-001' }))
            .rejects.toMatchObject({ status: 404});
    });

    test('calls fetchWaisResult with id_results from the request', async () => {
        mockResultsRepository.fetchWaisResult.mockResolvedValue(sampleRow);

        await useCase.execute({ id_results: 'r-001' });

        expect(mockResultsRepository.fetchWaisResult).toHaveBeenCalledWith({ id_results: 'r-001' });
    });

    test('maps a populated row to a DTO with all 4 areas and scoreTotal', async () => {
        mockResultsRepository.fetchWaisResult.mockResolvedValue(sampleRow);

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(2);
        expect(dto.status).toBe(3);
        expect(dto.dateApplied).toBe('2026-05-19');

        expect(dto.areas.comVerbal.score).toBe(100);
        expect(dto.areas.comVerbal.interpretation).toBe('Promedio');
        expect(dto.areas.razonPerceptual.score).toBe(95);
        expect(dto.areas.memWork.score).toBe(105);
        expect(dto.areas.veloProce.interpretation).toBe('Promedio alto');

        expect(dto.scoreTotal).toBe(410);
        expect(dto.notes).toBe('CI promedio');
    });

    test('defaults dateApplied and notes to null when absent', async () => {
        mockResultsRepository.fetchWaisResult.mockResolvedValue({
            id_results: 'r-001',
            status: 1,
            score_com_verbal: null,       inter_com_verbal: null,
            score_razon_perceptual: null, inter_razon_perceptual: null,
            score_mem_work: null,         inter_mem_work: null,
            score_velo_proce: null,       inter_velo_proce: null,
            score_total: null,
        });

        const dto = await useCase.execute({ id_results: 'r-001' });
        expect(dto.dateApplied).toBeNull();
        expect(dto.notes).toBeNull();
    });

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchWaisResult.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ id_results: 'r-001' })).rejects.toThrow('DB error');
    });
});