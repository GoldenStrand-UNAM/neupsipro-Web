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

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => {
  return () => (req, res, next) => next();
});

const app = require('../../../Back/src/app');

describe('GET /dashboard', () => {
    test('returns status 200 and dashboard data', async () => {
        const res = await request(app).get('/dashboard');
        expect(res.status).toBe(200);
    });
});
