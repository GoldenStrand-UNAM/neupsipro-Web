const getBANFEResultUseCase = require('../../../Back/src/application/usecase/testApplications/getBanfeUseCase');

describe('getBanfeResultUseCase — Unit Tests', () => {
    let mockResultsRepository;
    let useCase;

    const sampleRow = {
        id_results: 'r-001',
        status: 3,
        date_applied: '2026-05-19',
        score_orbit_frontal: 100,     inter_orbit_frontal: 'Normal',
        score_prefrontal_before: 95,  inter_prefrontal_before: 'Normal',
        score_d_lateral: 90,          inter_d_lateral: 'Normal',
        score_total: 285,
        notes: 'Observaciones',
    };

    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = { fetchBanfeResult: jest.fn() };
        useCase = new getBANFEResultUseCase(mockResultsRepository);
    });

    test('throws 404 if the BANFE result is not found', async () => {
        mockResultsRepository.fetchBanfeResult.mockResolvedValue(null);
        await expect(useCase.execute({ id_results: 'r-001' }))
            .rejects.toMatchObject({ status: 404, message: 'BANFE result not found' });
    });

    test('calls fetchBanfeResult with id_results from the request', async () => {
        mockResultsRepository.fetchBanfeResult.mockResolvedValue(sampleRow);

        await useCase.execute({ id_results: 'r-001' });

        expect(mockResultsRepository.fetchBanfeResult).toHaveBeenCalledWith({ id_results: 'r-001' });
        expect(mockResultsRepository.fetchBanfeResult).toHaveBeenCalledTimes(1);
    });


    // Maps repository row into BANFE DTO structure
    test('returns DTO with all 3 cognitive areas and total score', async()=>{
        mockResultsRepository.fetchBanfeResult.mockResolvedValue(sampleRow);

        const dto = await useCase.execute({ id_results: 'r-001' });

        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(1);
        expect(dto.status).toBe(3);
        expect(dto.dateApplied).toBe('2026-05-19');

        expect(dto.areas.orbitFrontal.score).toBe(100);
        expect(dto.areas.orbitFrontal.interpretation).toBe('Normal');
        expect(dto.areas.prefrontalBefore.score).toBe(95);
        expect(dto.areas.dLateral.score).toBe(90);

        expect(dto.scoreTotal).toBe(285);
        expect(dto.notes).toBe('Observaciones');
    });

    // Optional DTO fields should default to null
    test('defaults dateApplied and notes to null when absent', async()=>{
        mockResultsRepository.fetchBanfeResult.mockResolvedValue({
            id_results: 'r-001',
            status: 1,
            score_orbit_frontal: null,    inter_orbit_frontal: null,
            score_prefrontal_before: null, inter_prefrontal_before: null,
            score_d_lateral: null,        inter_d_lateral: null,
            score_total: null,
        });

        const dto = await useCase.execute({ id_results: 'r-001' });
        expect(dto.dateApplied).toBeNull();
        expect(dto.notes).toBeNull();
        expect(dto.status).toBe(1);
    });

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchBanfeResult.mockRejectedValue(new Error('DB error'));
        await expect(useCase.execute({ id_results: 'r-001' })).rejects.toThrow('DB error');
    });
});