const postNIHUseCase = require('../../../Back/src/application/usecase/testApplications/postNihUseCase');

describe('postNIHUseCase — Unit Tests (Story R01)', () => {
    let mockResultsRepository;
    let useCase;

    const validInput = {
        id_user: 'user-001',
        id_application: 'app-001',
        notes: 'Observaciones neurológicas detalladas',
    };

    const sampleFetchedRow = { idResults: 'r-001', status: 1 };

    const sampleSavedRow = {
        id_results: 'r-001',
        notes: validInput.notes,
        status: 3,
        date_applied: '2026-05-19',
    };

    beforeEach(() => {
        mockResultsRepository = {
            fetchResultRow: jest.fn(),
            saveNihResult: jest.fn(),
        };
        useCase = new postNIHUseCase(mockResultsRepository);
    });


    test('throws 422 if notes exceed 500 characters', async () => {
        await expect(useCase.execute({ ...validInput, notes: 'a'.repeat(501) }))
            .rejects.toMatchObject({ status: 422, message: 'notes must be 500 characters or less' });
    });

    test('accepts notes of exactly 500 characters (inclusive boundary)', async () => {
        const exactlyMax = 'a'.repeat(500);
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockResolvedValue({ ...sampleSavedRow, notes: exactlyMax });

        const dto = await useCase.execute({ ...validInput, notes: exactlyMax });
        expect(dto.notes).toHaveLength(500);
    });

    
    test('does not throw 422 when notes is an empty string', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockResolvedValue({ ...sampleSavedRow, notes: null });

        await expect(useCase.execute({ ...validInput, notes: '' }))
            .resolves.toBeDefined();
    });

    test('throws 404 if the parent test_results row is not found', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(null);

        await expect(useCase.execute(validInput))
            .rejects.toMatchObject({ status: 404, message: 'Test result row not found' });

        expect(mockResultsRepository.fetchResultRow).toHaveBeenCalledWith({
            id_user: 'user-001',
            id_application: 'app-001',
            id_test: 5,
        });
        expect(mockResultsRepository.saveNihResult).not.toHaveBeenCalled();
    });

    // Happy path
    test('persists NIH result and returns DTO with status 3', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockResolvedValue(sampleSavedRow);

        const dto = await useCase.execute(validInput);

        expect(mockResultsRepository.saveNihResult).toHaveBeenCalledTimes(1);
        expect(dto.idResults).toBe('r-001');
        expect(dto.idTest).toBe(5);
        expect(dto.status).toBe(3);
        expect(dto.notes).toBe(validInput.notes);
        expect(dto.dateApplied).toBe('2026-05-19');
    });

    test('saveNihResult is called with id_results from the fetched row', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockResolvedValue(sampleSavedRow);

        await useCase.execute(validInput);

        expect(mockResultsRepository.saveNihResult).toHaveBeenCalledWith({
            id_results: 'r-001',
            notes: validInput.notes,
        });
    });

    test('normalizes undefined notes to null in the persisted payload', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockResolvedValue({ ...sampleSavedRow, notes: null });

        await useCase.execute({
            id_user: 'user-001',
            id_application: 'app-001',
        });

        expect(mockResultsRepository.saveNihResult).toHaveBeenCalledWith({
            id_results: 'r-001',
            notes: null,
        });
    });

    //  Error handling
    test('propagates errors from fetchResultRow to the caller', async () => {
        mockResultsRepository.fetchResultRow.mockRejectedValue(new Error('DB unreachable'));
        await expect(useCase.execute(validInput)).rejects.toThrow('DB unreachable');
    });

    test('propagates errors from saveNihResult to the caller', async () => {
        mockResultsRepository.fetchResultRow.mockResolvedValue(sampleFetchedRow);
        mockResultsRepository.saveNihResult.mockRejectedValue(new Error('INSERT failed'));

        await expect(useCase.execute(validInput)).rejects.toThrow('INSERT failed');
        expect(mockResultsRepository.fetchResultRow).toHaveBeenCalled();
    });
});