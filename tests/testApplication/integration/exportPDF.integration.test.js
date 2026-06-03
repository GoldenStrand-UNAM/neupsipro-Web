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

jest.mock('../../../Back/src/application/usecase/testApplications/exportPdfUseCase', () =>
    jest.fn().mockImplementation(() => ({ execute: mockExecuteExport }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const exportUrl = '/users/1/applications/app-001/export';

describe(' GET /users/:id_user/applications/:id_application/export', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        asAuthenticated();
    });

    test('base — responds 200 with a PDF attachment', async () => {
        mockExecuteExport.mockResolvedValue({
            pdfBuffer: Buffer.from('%PDF-1.4 fake pdf'),
            filename: 'reporte_app_2026-05-20.pdf',
        });

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(200);
        expect(res.header['content-type']).toContain('application/pdf');
        expect(res.header['content-disposition'])
            .toBe('attachment; filename="reporte_app_2026-05-20.pdf"');
    });

    test('passes id_user and id_application from the route to the use case', async () => {
        mockExecuteExport.mockResolvedValue({
            pdfBuffer: Buffer.from('pdf'),
            filename: 'reporte.pdf',
        });

        await request(app).get(exportUrl);

        expect(mockExecuteExport).toHaveBeenCalledWith({
            id_user: '1',
            id_application: 'app-001',
        });
    });

    test('responds 404 when the application is not found', async () => {
        const err = new Error('Application not found');
        err.status = 404;
        mockExecuteExport.mockRejectedValue(err);

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'Application not found' });
        expect(res.text).not.toContain('stack');
    });

    test('responds 422 when the application is not completed', async () => {
        const err = new Error('Application is not completed');
        err.status = 422;
        mockExecuteExport.mockRejectedValue(err);

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(422);
        expect(res.body).toEqual({ error: 'Application is not completed' });
    });

    test('responds 404 when the user is not found', async () => {
        const err = new Error('User not found');
        err.status = 404;
        mockExecuteExport.mockRejectedValue(err);

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(404);
        expect(res.body).toEqual({ error: 'User not found' });
    });

    test('responds 500 when the error has no status (e.g. PDF generation failed)', async () => {
        mockExecuteExport.mockRejectedValue(new Error('puppeteer crashed'));

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'puppeteer crashed' });
        expect(res.text).not.toContain('stack');
    });


    test('redirects to /auth/ when there is no active session', async () => {
        asUnauthenticated();

        const res = await request(app).get(exportUrl);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/auth/');
    });
});