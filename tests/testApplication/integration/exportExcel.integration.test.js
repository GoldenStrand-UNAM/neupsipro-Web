const request = require('supertest');

let mockAuthBehavior = 'authenticated';

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
    jest.fn(() => ({
        verifyToken: (req, res, next) => {
            if (mockAuthBehavior === 'unauthenticated') {
                return res.redirect('/auth/');
            }
            req.user = { id: 1, role: 'admin' };
            next();
        },
    }))
);

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
    jest.fn(() => ({
        requirePermission: () => (req, res, next) => next(),
    }))
);

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
    loginLimiter:       (req, res, next) => next(),
    generalLimiter:     (req, res, next) => next(),
    apiLimiter:         (req, res, next) => next(),
    publicationLimiter: (req, res, next) => next(),
    userLimiter:        (req, res, next) => next(),
}));

const mockExecuteExport = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/exportTestResultsCsvUseCase', () =>
    jest.fn().mockImplementation(() => ({ execute: mockExecuteExport }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const EXPORT_URL = '/api/reports/tests/export';

const sampleRows = [
    { test_type: 'BANFE', user_name: 'jperez', score_total: 30, notes: 'ok' },
    { test_type: 'WAIS', user_name: 'mgomez', score_total: 103, notes: 'nota, con coma' },
];

describe(' GET /export · test results CSV', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        asAuthenticated();
    });

    test('base — responds 200 with a CSV attachment', async () => {
        mockExecuteExport.mockResolvedValue({
            test: 'all',
            filename: 'all_test_results.csv',
            rows: sampleRows,
        });

        const res = await request(app).get(EXPORT_URL);

        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('text/csv');
        expect(res.header['content-disposition'])
            .toBe('attachment; filename="all_test_results.csv"');
    });

    test('passes the test query param to the use case', async () => {
        mockExecuteExport.mockResolvedValue({
            test: 'banfe',
            filename: 'banfe_results.csv',
            rows: sampleRows,
        });

        await request(app).get(EXPORT_URL).query({ test: 'banfe' });

        expect(mockExecuteExport).toHaveBeenCalledWith({ test: 'banfe' });
    });

    test('defaults to "all" when no test query param is sent', async () => {
        mockExecuteExport.mockResolvedValue({
            test: 'all',
            filename: 'all_test_results.csv',
            rows: sampleRows,
        });

        await request(app).get(EXPORT_URL);

        expect(mockExecuteExport).toHaveBeenCalledWith({ test: 'all' });
    });


    test('responds 400 when the test type is invalid', async () => {
        const err = new Error('Tipo de prueba inválido');
        err.status = 400;
        mockExecuteExport.mockRejectedValue(err);

        const res = await request(app).get(EXPORT_URL).query({ test: 'moca' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'Tipo de prueba inválido' });
    });


    test('redirects to /auth/ when there is no active session', async () => {
        asUnauthenticated();

        const res = await request(app).get(EXPORT_URL);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/auth/');
    });
});