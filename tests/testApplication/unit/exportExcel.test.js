const ExportTestResultsCsvUseCase = require('../../../Back/src/application/usecase/testApplications/exportTestResultsCsvUseCase');

describe('ExportTestResultsCsvUseCase — Unit Tests', () => {
    let mockTestExportRepository;
    let useCase;

    const sampleRows = [
        { id_results: 'r-1', score_total: 30 },
        { id_results: 'r-2', score_total: 25 },
    ];

    beforeEach(() => {
        mockTestExportRepository = {
            fetchAllResults: jest.fn(),
            fetchBanfeResults: jest.fn(),
            fetchWaisResults: jest.fn(),
            fetchReyResults: jest.fn(),
        };
        useCase = new ExportTestResultsCsvUseCase(mockTestExportRepository);
    });

    // validation

    test('throws 400 if the test type is invalid', async () => {
        await expect(useCase.execute({ test: 'moca' }))
            .rejects.toMatchObject({ status: 400, message: 'Tipo de prueba inválido' });
    });

    test('does not call the repository when the test type is invalid', async () => {
        await expect(useCase.execute({ test: 'invalid' })).rejects.toThrow();

        expect(mockTestExportRepository.fetchAllResults).not.toHaveBeenCalled();
        expect(mockTestExportRepository.fetchBanfeResults).not.toHaveBeenCalled();
        expect(mockTestExportRepository.fetchWaisResults).not.toHaveBeenCalled();
        expect(mockTestExportRepository.fetchReyResults).not.toHaveBeenCalled();
    });


    test('defaults to "all" when no test is provided', async () => {
        mockTestExportRepository.fetchAllResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({});

        expect(result.test).toBe('all');
        expect(result.filename).toBe('all_test_results.csv');
        expect(mockTestExportRepository.fetchAllResults).toHaveBeenCalled();
    });

    test('normalizes uppercase and whitespace in the test type', async () => {
        mockTestExportRepository.fetchBanfeResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({ test: '  BANFE  ' });

        expect(result.test).toBe('banfe');
        expect(mockTestExportRepository.fetchBanfeResults).toHaveBeenCalled();
    });


    test('exports ALL results', async () => {
        mockTestExportRepository.fetchAllResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({ test: 'all' });

        expect(result).toEqual({
            test: 'all',
            filename: 'all_test_results.csv',
            rows: sampleRows,
        });
        expect(mockTestExportRepository.fetchAllResults).toHaveBeenCalledTimes(1);
    });

    test('exports BANFE results', async () => {
        mockTestExportRepository.fetchBanfeResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({ test: 'banfe' });

        expect(result).toEqual({
            test: 'banfe',
            filename: 'banfe_results.csv',
            rows: sampleRows,
        });
        expect(mockTestExportRepository.fetchBanfeResults).toHaveBeenCalledTimes(1);
    });

    test('exports WAIS results', async () => {
        mockTestExportRepository.fetchWaisResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({ test: 'wais' });

        expect(result).toEqual({
            test: 'wais',
            filename: 'wais_results.csv',
            rows: sampleRows,
        });
        expect(mockTestExportRepository.fetchWaisResults).toHaveBeenCalledTimes(1);
    });

    test('exports REY results', async () => {
        mockTestExportRepository.fetchReyResults.mockResolvedValue(sampleRows);

        const result = await useCase.execute({ test: 'rey' });

        expect(result).toEqual({
            test: 'rey',
            filename: 'rey_results.csv',
            rows: sampleRows,
        });
        expect(mockTestExportRepository.fetchReyResults).toHaveBeenCalledTimes(1);
    });


    test('returns an empty rows array when the repository has no data', async () => {
        mockTestExportRepository.fetchAllResults.mockResolvedValue([]);

        const result = await useCase.execute({ test: 'all' });

        expect(result.rows).toEqual([]);
    });

    test('calls only the fetch method matching the selected test', async () => {
        mockTestExportRepository.fetchWaisResults.mockResolvedValue(sampleRows);

        await useCase.execute({ test: 'wais' });

        expect(mockTestExportRepository.fetchWaisResults).toHaveBeenCalledTimes(1);
        expect(mockTestExportRepository.fetchAllResults).not.toHaveBeenCalled();
        expect(mockTestExportRepository.fetchBanfeResults).not.toHaveBeenCalled();
        expect(mockTestExportRepository.fetchReyResults).not.toHaveBeenCalled();
    });

    // error handling

    test('propagates repository errors to the caller', async () => {
        mockTestExportRepository.fetchAllResults.mockRejectedValue(new Error('DB error'));

        await expect(useCase.execute({ test: 'all' })).rejects.toThrow('DB error');
    });
});