const postWAISUseCase = require('../../../Back/src/application/usecase/testApplications/postWAISUseCase');

describe('postWAISUseCase — Unit Tests (Story R01)', () => {
    let mockResultsRepository;
    let useCase;

    const validInput = {
        id_user: 'user-001',
        id_application: 'app-001',
        score_com_verbal: 100,
        score_razon_perceptual: 95,
        score_mem_work: 105,
        score_velo_proce: 110,
        score_total: 100,
        notes: 'CI dentro de rango promedio',
    };

    const sampleFetchedRow = { idResults: 'r-001', status: 1 };

    const sampleSavedRow = {
        id_results: 'r-001',
        score_com_verbal: 100,       inter_com_verbal: 'Promedio',
        score_razon_perceptual: 95,  inter_razon_perceptual: 'Promedio',
        score_mem_work: 105,         inter_mem_work: 'Promedio',
        score_velo_proce: 110,       inter_velo_proce: 'Promedio alto',
        score_total: 100,
        notes: validInput.notes,
        status: 3,
        date_applied: '2026-05-19',
    };

    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = {
            fetchResultRow: jest.fn(),
            saveWAISResult: jest.fn(),
        };
        useCase = new postWAISUseCase(mockResultsRepository);
    });

    //  Validation tests
    test.each([
        ['score_com_verbal',       undefined],
        ['score_razon_perceptual', null],
        ['score_mem_work',         ''],
        ['score_velo_proce',       'NaN'],
        ['score_total',            undefined],
    ])('throws 422 if %s is missing or not numeric (%p)', async (field, value) => {
        await expect(useCase.execute({ ...validInput, [field]: value }))
            .rejects.toMatchObject({ status: 422 });
    });

    // Each score must also be non-negative
    test.each([
        'score_com_verbal',
        'score_razon_perceptual',
        'score_mem_work',
        'score_velo_proce',
        'score_total',
    ])('throws 422 if %s is negative', async (field) => {
        await expect(useCase.execute({ ...validInput, [field]: -1 }))
            .rejects.toMatchObject({ status: 422 });
    });

    test('throws 422 if notes exceed 200 characters', async () => {
        await expect(useCase.execute({ ...validInput, notes: 'a'.repeat(201) }))
            .rejects.toMatchObject({ status: 422 });
    });


    test('throws 404 if the parent test_results row is not found', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(null);

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 404, message: 'Test result row not found' });

        expect(mockResultsRepository.fetchResultRow).toHaveBeenCalledWith({
            id_user: 'user-001',
            id_application: 'app-001',
            id_test: 2,
        });
        expect(mockResultsRepository.saveWAISResult).not.toHaveBeenCalled();
    });

    test.each([
        [140, 'Alta capacidad intelectual'],
        [130, 'Alta capacidad intelectual'], 
        [129, 'Superior'],
        [120, 'Superior'],                  
        [119, 'Promedio alto'],
        [110, 'Promedio alto'],         
        [109, 'Promedio'],
        [90,  'Promedio'],               
        [89,  'Promedio bajo'],
        [80,  'Promedio bajo'],        
        [79,  'Limítrofe'],
        [70,  'Limítrofe'],                 
        [69,  'Discapacidad'],
        [0,   'Discapacidad'],
    ])('resolveInterpretation(%i) returns "%s"', (score, expected) => {
        expect(useCase.resolveInterpretation(score)).toBe(expected);
    });

    //  Happy path 

    test('persists WAIS result and returns DTO with all 4 areas', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveWAISResult.mockResolvedValue(sampleSavedRow);

        const dto = await useCase.execute(validInput);

        expect(mockResultsRepository.saveWAISResult).toHaveBeenCalledTimes(1);
        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(2);
        expect(dto.status).toBe(3);
        expect(dto.areas.comVerbal.score).toBe(100);
        expect(dto.areas.comVerbal.interpretation).toBe('Promedio');
        expect(dto.areas.razonPerceptual.score).toBe(95);
        expect(dto.areas.memWork.score).toBe(105);
        expect(dto.areas.veloProce.interpretation).toBe('Promedio alto');
        expect(dto.scoreTotal).toBe(100);
        expect(dto.notes).toBe(validInput.notes);
    });

    test('recalculates all 4 interpretations server-side', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveWAISResult.mockImplementation(async (payload) => ({
            ...sampleSavedRow,
            inter_com_verbal: payload.inter_com_verbal,
            inter_razon_perceptual: payload.inter_razon_perceptual,
            inter_mem_work: payload.inter_mem_work,
            inter_velo_proce: payload.inter_velo_proce,
        }));

        await useCase.execute({
            ...validInput,
            score_com_verbal: 130,       
            score_razon_perceptual: 70, 
            score_mem_work: 60,        
            score_velo_proce: 95,      
        });

        const args = mockResultsRepository.saveWAISResult.mock.calls[0][0];
        expect(args.inter_com_verbal).toBe('Alta capacidad intelectual');
        expect(args.inter_razon_perceptual).toBe('Limítrofe');
        expect(args.inter_mem_work).toBe('Discapacidad');
        expect(args.inter_velo_proce).toBe('Promedio');
    });

    // Error handling

    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchResultRow.mockRejectedValue(new Error('DB timeout'));
        await expect(useCase.execute(validInput)).rejects.toThrow('DB timeout');
    });
});