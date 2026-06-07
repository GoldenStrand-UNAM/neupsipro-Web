const request = require('supertest');
const db      = require('../../../Back/src/infrastructure/database/database');

let mockAuthBehavior = 'unauthenticated';

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') {
        return res.status(401).json({ message: 'No autorizado' });
      }
      req.user = { id: 1, role: 'admin' };
      next();
    },
  }))
);

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
  jest.fn().mockImplementation(() => ({
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

jest.mock('../../../Back/src/infrastructure/database/database', () => ({
  query: jest.fn(),
}));

const app = require('../../../Back/src/app');

const asAuthenticated = () => { mockAuthBehavior = 'authenticated'; };

describe('INTEGRATION — DELETE /users/:id_user/applications/:id_application', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'unauthenticated';
  });

  test('must return 200 if the application is deleted successfully', async () => {
    asAuthenticated();

    db.query.mockResolvedValueOnce([[{
      id_application:   'app-1',
      id_user:          'user-1',
      application_name: 'Test App',
      status:           1,
      created_at:       new Date(),
    }], []]);

    db.query.mockResolvedValueOnce([{ affectedRows: 2 }, []]);
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }, []]);

    const res = await request(app).delete('/users/user-1/applications/app-1');

    expect(res.status).toBe(200);
    expect(res.body.data.deleted).toBe(true);
  });

  test('must return 404 if the application does not exist', async () => {
    asAuthenticated();

    db.query.mockResolvedValueOnce([[], []]);

    const res = await request(app).delete('/users/user-1/applications/app-999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Application not found');
  });

  test('must return 403 if the application belongs to a different user', async () => {
    asAuthenticated();

    db.query.mockResolvedValueOnce([[{
      id_application:   'app-1',
      id_user:          'user-2',
      application_name: 'Test App',
      status:           1,
      created_at:       new Date(),
    }], []]);

    const res = await request(app).delete('/users/user-1/applications/app-1');

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  test('must return 401 if not authenticated', async () => {
    const res = await request(app).delete('/users/user-1/applications/app-1');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No autorizado');
  });

  test('must return 500 if the database throws unexpectedly', async () => {
    asAuthenticated();

    db.query.mockRejectedValueOnce(new Error('Unexpected DB failure'));

    const res = await request(app).delete('/users/user-1/applications/app-1');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});