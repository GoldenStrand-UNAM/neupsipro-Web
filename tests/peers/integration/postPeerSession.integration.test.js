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

const mockExecutePost = jest.fn();

jest.mock('../../../Back/src/application/usecase/peers/postPeerSessionUseCase', () =>
    jest.fn().mockImplementation(() => ({ execute: mockExecutePost }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const POST_URL = '/peer-sessions/post';

const validBody = {
    responsable: 'Juan Pérez',
    title: 'Sesión de apoyo',
    note: 'Nota de prueba',
    session_date: '01/01/2024',
    men_count: 3,
    women_count: 2,
};

const sampleDTO = {
    title: 'Sesión de apoyo',
    responsable: 'Juan Pérez',
    note: 'Nota de prueba',
};

describe('POST /peer-sessions/post', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        asAuthenticated();
    });

    test('base — responds 201 with the created session', async () => {
        mockExecutePost.mockResolvedValue(sampleDTO);

        const res = await request(app).post(POST_URL).send(validBody);

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ data: sampleDTO });
    });

    test('passes the request body to the use case', async () => {
        mockExecutePost.mockResolvedValue(sampleDTO);

        await request(app).post(POST_URL).send(validBody);

        expect(mockExecutePost).toHaveBeenCalledWith(validBody);
    });

    test('responds 400 when responsable is missing', async () => {
        const err = new Error('El responsable es obligatorio');
        mockExecutePost.mockRejectedValue(err);

        const res = await request(app).post(POST_URL).send({ ...validBody, responsable: '' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'El responsable es obligatorio' });
    });

    test('responds 400 when title is missing', async () => {
        const err = new Error('El título es obligatorio');
        mockExecutePost.mockRejectedValue(err);

        const res = await request(app).post(POST_URL).send({ ...validBody, title: '' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'El título es obligatorio' });
    });

    test('responds 400 when session_date is missing', async () => {
        const err = new Error('La fecha es obligatoria');
        mockExecutePost.mockRejectedValue(err);

        const res = await request(app).post(POST_URL).send({ ...validBody, session_date: '' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'La fecha es obligatoria' });
    });

    test('responds 400 when session_date is in the future', async () => {
        const err = new Error('La fecha debe ser válida, anterior o igual a hoy y posterior a 1900');
        mockExecutePost.mockRejectedValue(err);

        const res = await request(app).post(POST_URL).send({ ...validBody, session_date: '01/01/2099' });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'La fecha debe ser válida, anterior o igual a hoy y posterior a 1900' });
    });

    test('responds 400 when there are no attendees', async () => {
        const err = new Error('La sesión debe tener al menos un asistente');
        mockExecutePost.mockRejectedValue(err);

        const res = await request(app).post(POST_URL).send({ ...validBody, men_count: 0, women_count: 0 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'La sesión debe tener al menos un asistente' });
    });

    test('responds 409 when the database throws a known DB error', async () => {
        const dbError = new Error('Duplicate entry');
        dbError.code = 'ER_DUP_ENTRY';
        mockExecutePost.mockRejectedValue(dbError);

        const res = await request(app).post(POST_URL).send(validBody);

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: 'Error al registrar la sesión.' });
    });

    test('responds 409 when the database throws an errno error', async () => {
        const dbError = new Error('Connection lost');
        dbError.errno = 1062;
        mockExecutePost.mockRejectedValue(dbError);

        const res = await request(app).post(POST_URL).send(validBody);

        expect(res.status).toBe(409);
        expect(res.body).toEqual({ error: 'Error al registrar la sesión.' });
    });

    test('redirects to /auth/ when there is no active session', async () => {
        asUnauthenticated();

        const res = await request(app).post(POST_URL).send(validBody);

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/auth/');
    });
});