const postBANFEUseCase = require('../../../Back/src/application/usecase/testApplications/postBANFEUseCase');

describe('postBANFEUseCase — Unit Tests (Story R01)', () => {
    let mockResultsRepository;
    let useCase;

    const validInput = {
        id_user: 'user-001',
        id_application: 'app-001',
        score_orbit_frontal: 100,
        score_prefrontal_before: 95,
        score_d_lateral: 90,
        notes: 'Paciente colaborador',
    };

    // Shape returned by fetchResultRow 
    const sampleFetchedRow = { idResults: 'r-001', status: 1 };

    // Shape returned by saveBANFEResult
    const sampleSavedRow = {
        id_results: 'r-001',
        score_orbit_frontal: 100,     inter_orbit_frontal: 'Normal',
        score_prefrontal_before: 95,  inter_prefrontal_before: 'Normal',
        score_d_lateral: 90,          inter_d_lateral: 'Normal',
        score_total: 285,
        notes: 'Paciente colaborador',
        status: 3,
        date_applied: '2026-05-19',
    };
    
    // Rebuild the use case and its mock repository before each test
    beforeEach(() => {
        mockResultsRepository = {
            fetchResultRow: jest.fn(),
            saveBANFEResult: jest.fn(),
        };
        useCase = new postBANFEUseCase(mockResultsRepository);
    });

    test.each([
        ['score_orbit_frontal',     undefined],
        ['score_prefrontal_before', null],
        ['score_d_lateral',         ''],
        ['score_orbit_frontal',     'not-a-number'],
    ])('throws 422 if %s is missing or not numeric (%p)', async (field, value) => {
        await expect(useCase.execute({ ...validInput, [field]: value }))
            .rejects.toMatchObject({ status: 422 });
    });


    test.each([
        ['score_orbit_frontal',     -1],
        ['score_prefrontal_before', -1],
        ['score_d_lateral',         -1],
    ])('throws 422 if %s is negative', async (field, value) => {
        await expect(useCase.execute({ ...validInput, [field]: value }))
            .rejects.toMatchObject({ status: 422 });
    });

    test('throws 422 if notes exceed 200 characters', async () => {
        await expect(useCase.execute({ ...validInput, notes: 'quijote'.repeat(201) }))
            .rejects.toMatchObject({ status: 422 });
    });

    test('accepts notes of exactly 200 characters (inclusive boundary)', async () => {
        const exactlyMax = 'a'.repeat(200);
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveBANFEResult.mockResolvedValue({ ...sampleSavedRow, notes: exactlyMax });

        const dto = await useCase.execute({ ...validInput, notes: exactlyMax });
        expect(dto.notes).toHaveLength(200);
    });

    test('throws 404 if the parent test_results row is not found', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(null);

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 404, message: 'Test result row not found' });

        expect(mockResultsRepository.fetchResultRow).toHaveBeenCalledWith({
            id_user: 'user-001',
            id_application: 'app-001',
            id_test: 1,
        });
        expect(mockResultsRepository.saveBANFEResult).not.toHaveBeenCalled();
    });

    //  Interpretation logic
    test.each([
        [130, 'Normal alto'],
        [116, 'Normal alto'],          
        [115, 'Normal'],
        [85,  'Normal'],               
        [84,  'Alteración leve-moderada'],
        [70,  'Alteración leve-moderada'], 
        [69,  'Alteración severa'],
        [0,   'Alteración severa'],
    ])('resolveInterpretation(%i) returns "%s"', (score, expected) => {
        expect(useCase.resolveInterpretation(score)).toBe(expected);
    });

    // happy path
    test('persists BANFE result and returns a DTO with all expected fields', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveBANFEResult.mockResolvedValue(sampleSavedRow);

        const dto = await useCase.execute(validInput);

        expect(mockResultsRepository.saveBANFEResult).toHaveBeenCalledTimes(1);
        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(1);
        expect(dto.status).toBe(3);
        expect(dto.areas.orbitFrontal.score).toBe(100);
        expect(dto.areas.orbitFrontal.interpretation).toBe('Normal');
        expect(dto.areas.prefrontalBefore.score).toBe(95);
        expect(dto.areas.dLateral.score).toBe(90);
        expect(dto.scoreTotal).toBe(285);
        expect(dto.notes).toBe('Paciente colaborador');
    });

    test('recalculates interpretations server side regardless of client input', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveBANFEResult.mockImplementation(async (payload) => ({
            ...sampleSavedRow,
            score_orbit_frontal: payload.score_orbit_frontal,
            inter_orbit_frontal: payload.inter_orbit_frontal,
        }));

        await useCase.execute({
            ...validInput,
            score_orbit_frontal: 50, 
        });

        const callArgs = mockResultsRepository.saveBANFEResult.mock.calls[0][0];
        expect(callArgs.inter_orbit_frontal).toBe('Alteración severa');
    });

    // optional fields default null
    test('persists notes as null when not provided', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveBANFEResult.mockResolvedValue({ ...sampleSavedRow, notes: null });

        await useCase.execute({
            id_user: 'user-001',
            id_application: 'app-001',
            score_orbit_frontal: 100,
            score_prefrontal_before: 95,
            score_d_lateral: 90,
        });

        const callArgs = mockResultsRepository.saveBANFEResult.mock.calls[0][0];
        expect(callArgs.notes).toBeNull();
    });

    // error handling
    test('propagates repository errors to the caller', async () => {
        mockResultsRepository.fetchResultRow.mockRejectedValue(new Error('DB unreachable'));
        await expect(useCase.execute(validInput)).rejects.toThrow('DB unreachable');
    });
});