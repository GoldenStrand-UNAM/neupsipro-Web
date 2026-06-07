const request = require('supertest');

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

const mockExecute = jest.fn();

jest.mock('../../../Back/src/infrastructure/repositories/ImpPeerSessionRepository', () =>
  jest.fn().mockImplementation(() => ({
    fetchAllForStats: mockExecute,
  }))
);

const app = require('../../../Back/src/app');

describe('GET /peer-sessions routes', () => {
  // Happy path
  test('GET /stats returns status 200', async () => {
    mockExecute.mockResolvedValue([{ title: 'Test', session_date: '2020-01-01', men_count: '3', women_count: '3' }]);

    const res = await request(app).get(`/peer-sessions/stats`);
    expect(res.status).toBe(200);
  });

  // Empty stats
  test('GET /stats returns status 200', async () => {
    mockExecute.mockResolvedValue([{ title: '', session_date: '', men_count: '0', women_count: '0' }]);

    const res = await request(app).get(`/peer-sessions/stats`);
    expect(res.status).toBe(200);
  });

  // DB error to connect
  test('responds 409 when the database throws a known DB error', async () => {
      const dbError = new Error('Internal Server Error');
      dbError.code = 'DB_CONN-ERROR';
      mockExecute.mockRejectedValue(dbError);

      const res = await request(app).get(`/peer-sessions/stats`);

      expect(res.status).toBe(409);
  });
});