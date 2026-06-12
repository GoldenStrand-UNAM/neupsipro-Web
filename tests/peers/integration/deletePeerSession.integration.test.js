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

const mockExecuteDelete = jest.fn();

jest.mock('../../../Back/src/application/usecase/peers/deletePeerSessionUseCase', () =>
    jest.fn().mockImplementation(() => ({ execute: mockExecuteDelete }))
);


const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; }

const DELETE_URL = '/peer-sessions/s-111';

describe('DELETE /peer-sessions/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('Happy Path - the session is deleted successfully', async () => {
        mockExecuteDelete.mockResolvedValue({success: true});
        const res = await request(app).delete(DELETE_URL);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Sesión eliminada", success: true });
    });
  
  test('Responds 400 when id session is missing', async () => {
        const err = new Error('El identificador de la sesión es obligatorio');
        mockExecuteDelete.mockRejectedValue(err);
        const res = await request(app).delete(DELETE_URL).send({ idPeerSession: null });
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'El identificador de la sesión es obligatorio' });
    });
  
  test('Responds 400 when it finds no session with that id', async() => {
    const err = new Error('La sesión no existe');
    mockExecuteDelete.mockRejectedValue(err);
    const res = await request(app).delete(DELETE_URL).send({ idPeerSession: "s-111" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'La sesión no existe' });

  })
});
