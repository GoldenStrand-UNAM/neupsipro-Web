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
const mockExecute2 = jest.fn();

jest.mock('../../../Back/src/infrastructure/repositories/ImpClinicalDashboardRepository', () =>
  jest.fn().mockImplementation(() => ({
    fetchNumberUsers: mockExecute,
    fetchAllWithClinical: mockExecute,
    fetchHistoricalNumberUsers: mockExecute,
    fetchInfoUser: mockExecute2
  }))
);

jest.mock('../../../Back/src/infrastructure/repositories/ImpAppointmentRepository', () =>
  jest.fn().mockImplementation(() => ({
    fecthAppointmentWithClinical: mockExecute 
  }))
);

const app = require('../../../Back/src/app');


describe('GET /dashboardClinical routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });
 
 test('returns status 200 and dashboard data', async () => {
        const res = await request(app).get('/dashboardClinical/view');
        expect(res.status).toBe(200);
    });
 
  test('GET /api/:idClinicalUser returns status 200 with a valid id', async () => {
    mockExecute.mockResolvedValue([{ idUser: '3' }]);
    const res = await request(app).get(`/dashboardClinical/api/3`);
    expect(res.status).toBe(200);
  });
 
  test('GET /api/user/:idUser returns status 200 with a valid id', async () => {
    mockExecute2.mockResolvedValue([{ idUser: 'u-006' }]);
    const res = await request(app).get(`/dashboardClinical/api/user/u-006`);
    expect(res.status).toBe(200);
  });
 
  test('GET /api returns status 200', async () => {
    const res = await request(app).get(`/dashboardClinical/api`);
    expect(res.status).toBe(200);
  });
 
});