const request = require('supertest');
const app = require('../../../Back/src/app');
const db = require('../../../Back/src/infrastructure/database/database');

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next();
    }
  }));
});

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next()
  }));
});

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

jest.mock('../../../Back/src/infrastructure/database/database', () => ({
  query: jest.fn()
}));

describe('GET /api/tutorial', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('return 200 & steps if page does have tutorial', async () => {

    const steps = [
      { step_order: 1, title: 'Bienvenido', content: 'Foro' },
      { step_order: 2, title: 'Nueva publicación', content: 'Da click aquí' }
    ];
    db.query.mockResolvedValue([steps]);

    const res = await request(app).get('/api/tutorial?page=forum');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(steps);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT step_order'),
      ['forum']
    );
  });

  test('return 400 & error if parameter not send', async () => {
    const res = await request(app).get('/api/tutorial');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Page requerida');
    expect(db.query).not.toHaveBeenCalled();
  });

  test('return 200 & empty array if page does not have a tutorial', async () => {
    db.query.mockResolvedValue([[]]);

    const res = await request(app).get('/api/tutorial?page=profile');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('return 500 if database fails', async () => {
    db.query.mockRejectedValue(new Error('Error de conexión a la BD'));

    const res = await request(app).get('/api/tutorial?page=forum');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error de conexión a la BD');
  });
});