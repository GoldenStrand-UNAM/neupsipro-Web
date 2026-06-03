const ExportPdfUseCase = require('../../../Back/src/application/usecase/testApplications/exportPdfUseCase');

describe('ExportPdfUseCase — Unit Tests', () => {
    let mockTestResultsRepository;
    let mockUsersRepository;
    let mockPdfService;
    let mockGetBanfeUseCase;
    let mockGetWaisUseCase;
    let mockGetReyUseCase;
    let mockGetMocaUseCase;  
    let mockGetNihUseCase; 
    let useCase;

    const sampleApplication = {
        idApplication: 'app-001',
        idUser: 'u-001',
        applicationName: 'Aplicacion Demo',
        status: 3,
        createdAt: '2026-05-01',
    };

    const sampleUser = {
        name: 'Juan Perez Lopez',
        protocol: 'Research',
        referenceNumber: 'REF-123',
    };

    // Rebuild the use case and all its mocks before each test
    beforeEach(() => {
        mockTestResultsRepository = {
            fetchApplicationById: jest.fn(),
            fetchAllResultsForExport: jest.fn(),
            updateApplicationAndTestsStatus: jest.fn(),
        };
        mockUsersRepository = {
            fetchUserForExport: jest.fn(),
        };
        mockPdfService = {
            generate: jest.fn(),
        };
        mockGetBanfeUseCase = { execute: jest.fn() };
        mockGetWaisUseCase = { execute: jest.fn() };
        mockGetReyUseCase = { execute: jest.fn() };
        mockGetMocaUseCase = { execute: jest.fn() };  
        mockGetNihUseCase = { execute: jest.fn() }; 

        useCase = new ExportPdfUseCase(
            mockTestResultsRepository,
            mockUsersRepository,
            mockPdfService,
            mockGetBanfeUseCase,
            mockGetWaisUseCase,
            mockGetReyUseCase,
            mockGetMocaUseCase,   
            mockGetNihUseCase 
        );
    });

    // validations
    test('throws 404 if the application is not found', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(null);

        await expect(useCase.execute({ id_user: 'u-001', id_application: 'app-001' }))
            .rejects.toMatchObject({ status: 404, message: 'Application not found' });

        expect(mockTestResultsRepository.fetchApplicationById)
            .toHaveBeenCalledWith({ id_application: 'app-001' });
    });

    test('throws 422 if the application is not completed', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue({
            ...sampleApplication,
            status: 1,
        });

        await expect(useCase.execute({ id_user: 'u-001', id_application: 'app-001' }))
            .rejects.toMatchObject({ status: 422, message: 'Application is not completed' });
    });

    test('throws 404 if the user is not found', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue(null);

        await expect(useCase.execute({ id_user: 'u-001', id_application: 'app-001' }))
            .rejects.toMatchObject({ status: 404, message: 'User not found' });

        expect(mockUsersRepository.fetchUserForExport)
            .toHaveBeenCalledWith({ id_user: 'u-001' });
    });

    test('accepts an application with status DELIVERED (4)', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue({
            ...sampleApplication,
            status: 4,
        });
        mockUsersRepository.fetchUserForExport.mockResolvedValue(sampleUser);
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([]);
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await expect(useCase.execute({ id_user: 'u-001', id_application: 'app-001' }))
            .resolves.toBeDefined();
    });

    test('builds the report with patient header and delivered status', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue(sampleUser);
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([]);
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.patientName).toBe('Juan Perez Lopez');
        expect(report.protocolLabel).toBe('Investigación');
        expect(report.applicationName).toBe('Aplicacion Demo');
        expect(report.statusLabel).toBe('Entregado');
        expect(report.results).toEqual([]);
    });

    test('falls back to the raw protocol value when there is no label mapping', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue({
            ...sampleUser,
            protocol: 'UnknownProtocol',
        });
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([]);
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.protocolLabel).toBe('UnknownProtocol');
    });

    test('builds a BANFE section for idTest 1', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue(sampleUser);
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([
            { idResults: 'r-1', idTest: 1, dateApplied: '2026-05-10' },
        ]);
        mockGetBanfeUseCase.execute.mockResolvedValue({
            areas: {
                orbitFrontal: { score: 10, interpretation: 'Normal' },
                prefrontalBefore: { score: 12, interpretation: 'Alto' },
                dLateral: { score: 8, interpretation: 'Bajo' },
            },
            scoreTotal: 30,
            notes: 'sin observaciones',
        });
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        expect(mockGetBanfeUseCase.execute).toHaveBeenCalledWith({ id_results: 'r-1' });
        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.results).toHaveLength(1);
        expect(report.results[0].testName).toBe('BANFE');
        expect(report.results[0].totalRow).toEqual(['Score Total', 30, '']);
        expect(report.results[0].notes).toBe('sin observaciones');
    });

    test('builds a WAIS section for idTest 2', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue(sampleUser);
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([
            { idResults: 'r-2', idTest: 2, dateApplied: '2026-05-11' },
        ]);
        mockGetWaisUseCase.execute.mockResolvedValue({
            areas: {
                comVerbal: { score: 100, interpretation: 'Promedio' },
                razonPerceptual: { score: 105, interpretation: 'Promedio' },
                memWork: { score: 98, interpretation: 'Promedio' },
                veloProce: { score: 110, interpretation: 'Alto' },
            },
            scoreTotal: 103,
            notes: 'nota wais',
        });
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        expect(mockGetWaisUseCase.execute).toHaveBeenCalledWith({ id_results: 'r-2' });
        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.results[0].testName).toBe('WAIS');
        expect(report.results[0].totalRow).toEqual(['CI Total', 103, '']);
    });

    test('builds a REY section for idTest 3 with no total row', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue(sampleUser);
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([
            { idResults: 'r-3', idTest: 3, dateApplied: '2026-05-12' },
        ]);
        mockGetReyUseCase.execute.mockResolvedValue({
            rc: { score: 30, pc: 75, time: 120, pcTime: 60 },
            mcp: { score: 20, pc: 50, time: 90, pcTime: 40 },
            mlp: { score: 18, pc: 45, time: 80, pcTime: 35 },
            notes: 'nota rey',
        });
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        expect(mockGetReyUseCase.execute).toHaveBeenCalledWith({ id_results: 'r-3' });
        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.results[0].testName).toBe('REY');
        expect(report.results[0].totalRow).toBeNull();
        expect(report.results[0].rows[0]).toEqual(['R - C', 30, 75, 120, 60]);
    });

    // error handler

    test('propagates repository errors to the caller', async () => {
        mockTestResultsRepository.fetchApplicationById.mockRejectedValue(new Error('DB error'));

        await expect(useCase.execute({ id_user: 'u-001', id_application: 'app-001' }))
            .rejects.toThrow('DB error');
    });

    // Clinical
    test('builds a MOCA section for idTest 4', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue({ ...sampleUser, protocol: 'Clinical' });
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([
            { idResults: 'r-moca', idTest: 4, dateApplied: '2026-05-15' },
        ]);
        mockGetMocaUseCase.execute.mockResolvedValue({
            score: 27,
            interpretation: 'Normal',
            notes: 'sin deterioro cognitivo',
        });
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        expect(mockGetMocaUseCase.execute).toHaveBeenCalledWith({ id_results: 'r-moca' });
        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.protocolLabel).toBe('Clínico');
        expect(report.results[0].testName).toBe('MOCA');
        expect(report.results[0].rows).toEqual([['Score Total', 27, 'Normal']]);
        expect(report.results[0].totalRow).toBeNull();
        expect(report.results[0].notes).toBe('sin deterioro cognitivo');
    });

    test('builds a NIH Toolbox section for idTest 5', async () => {
        mockTestResultsRepository.fetchApplicationById.mockResolvedValue(sampleApplication);
        mockUsersRepository.fetchUserForExport.mockResolvedValue({ ...sampleUser, protocol: 'Clinical' });
        mockTestResultsRepository.fetchAllResultsForExport.mockResolvedValue([
            { idResults: 'r-nih', idTest: 5, dateApplied: '2026-05-16' },
        ]);
        mockGetNihUseCase.execute.mockResolvedValue({ notes: 'observaciones NIH' });
        mockPdfService.generate.mockResolvedValue(Buffer.from('pdf'));
        mockTestResultsRepository.updateApplicationAndTestsStatus.mockResolvedValue();

        await useCase.execute({ id_user: 'u-001', id_application: 'app-001' });

        expect(mockGetNihUseCase.execute).toHaveBeenCalledWith({ id_results: 'r-nih' });
        const report = mockPdfService.generate.mock.calls[0][0];
        expect(report.results[0].testName).toBe('NIH Toolbox');
        expect(report.results[0].columns).toEqual(['Observaciones']);
        expect(report.results[0].rows).toEqual([]);
        expect(report.results[0].notes).toBe('observaciones NIH');
    });
});