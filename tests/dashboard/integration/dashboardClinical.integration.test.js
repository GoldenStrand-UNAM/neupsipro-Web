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


describe('GET /dashboardClinical routes', () => {
 
 test('returns status 200 and dashboard data', async () => {
        const res = await request(app).get('/dashboardClinical/view');
        expect(res.status).toBe(200);
    });
 
  test('GET /api/:idClinicalUser returns status 200 with a valid id', async () => {
    const res = await request(app).get(`/dashboardClinical/api/3`);  // works for the moment but if the users change this will fail
    expect(res.status).toBe(200);
  });
 
  test('GET /api/user/:idUser returns status 200 with a valid id', async () => {
    const res = await request(app).get(`/dashboardClinical/api/user/u-006`); // works for the moment but if the users change this will fail
    expect(res.status).toBe(200);
  });
 
  test('GET /api returns status 200', async () => {
    const res = await request(app).get(`/dashboardClinical/api`);
    expect(res.status).toBe(200);
  });
 
});
