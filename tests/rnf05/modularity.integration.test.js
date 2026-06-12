const request = require('supertest');

jest.mock('../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin', userId: 1 };
      next();
    },
  }));
});

jest.mock('../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next(),
  }));
});

jest.mock('../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:       (req, res, next) => next(),
  generalLimiter:     (req, res, next) => next(),
  apiLimiter:         (req, res, next) => next(),
  publicationLimiter: (req, res, next) => next(),
  userLimiter:        (req, res, next) => next(),
}));

const app = require('../../Back/src/app');
const db = require('../../Back/src/infrastructure/database/database');

const ForumRepository = require('../../Back/src/infrastructure/repositories/ImpForumRepository');
const UsersRepository = require('../../Back/src/infrastructure/repositories/ImpUsersRepository');
const AppointmentRepository = require('../../Back/src/infrastructure/repositories/ImpAppointmentRepository');
const ClinicalRepository = require('../../Back/src/infrastructure/repositories/ImpClinicalRepository');
const DashboardUnitRepository = require('../../Back/src/infrastructure/repositories/ImpDashboardUnitRepository');
const TutorialRepository = require('../../Back/src/infrastructure/repositories/ImpTutorialRepository');

const expectControlledResponse = (response) => {
  expect([200, 400, 404, 409, 500]).toContain(response.status);
};

describe('RNF05 - Aislamiento funcional entre módulos principales', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();

    if (db.end) {
      await db.end();
    }
  });

  test('si falla forum API, users sigue respondiendo', async () => {
    jest
      .spyOn(ForumRepository.prototype, 'fetchAll')
      .mockRejectedValueOnce(new Error('RNF05 simulated forum failure'));

    jest
      .spyOn(ForumRepository.prototype, 'count')
      .mockRejectedValueOnce(new Error('RNF05 simulated forum failure'));

    const failedModuleResponse = await request(app)
      .get('/api/forum')
      .query({ page: 1, limit: 6 });

    expectControlledResponse(failedModuleResponse);

    const healthyModuleResponse = await request(app)
      .get('/users')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });

  test('si falla users, forum API sigue respondiendo', async () => {
    jest
      .spyOn(UsersRepository.prototype, 'fetchActivePatients')
      .mockRejectedValueOnce(new Error('RNF05 simulated users failure'));

    jest
      .spyOn(UsersRepository.prototype, 'countActivePatients')
      .mockRejectedValueOnce(new Error('RNF05 simulated users failure'));

    const failedModuleResponse = await request(app)
      .get('/users')
      .query({ page: 1, limit: 6 });

    expectControlledResponse(failedModuleResponse);

    jest
      .spyOn(ForumRepository.prototype, 'fetchAll')
      .mockResolvedValueOnce([]);

    jest
      .spyOn(ForumRepository.prototype, 'count')
      .mockResolvedValueOnce(0);

    const healthyModuleResponse = await request(app)
      .get('/api/forum')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });

  test('si falla appointments, forum API sigue respondiendo', async () => {
    jest
      .spyOn(AppointmentRepository.prototype, 'findUpcomingByUser')
      .mockRejectedValueOnce(new Error('RNF05 simulated appointments failure'));

    const failedModuleResponse = await request(app)
      .post('/users/u-001/appointments')
      .send({
        issue: 'RNF05 simulated appointment',
        date_time: '2026-01-01 10:00:00',
      });

    expectControlledResponse(failedModuleResponse);

    jest
      .spyOn(ForumRepository.prototype, 'fetchAll')
      .mockResolvedValueOnce([]);

    jest
      .spyOn(ForumRepository.prototype, 'count')
      .mockResolvedValueOnce(0);

    const healthyModuleResponse = await request(app)
      .get('/api/forum')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });

  test('si falla clinical, users sigue respondiendo', async () => {
    jest
      .spyOn(ClinicalRepository.prototype, 'fetchActivePatients')
      .mockRejectedValueOnce(new Error('RNF05 simulated clinical failure'));

    jest
      .spyOn(ClinicalRepository.prototype, 'countActivePatients')
      .mockRejectedValueOnce(new Error('RNF05 simulated clinical failure'));

    const failedModuleResponse = await request(app)
      .get('/clinical')
      .query({ page: 1, limit: 6 });

    expectControlledResponse(failedModuleResponse);

    const healthyModuleResponse = await request(app)
      .get('/users')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });

  test('si falla dashboard, forum API sigue respondiendo', async () => {
    jest
      .spyOn(DashboardUnitRepository.prototype, 'fetchCounts')
      .mockRejectedValueOnce(new Error('RNF05 simulated dashboard failure'));

    const failedModuleResponse = await request(app)
      .get('/dashboard');

    expectControlledResponse(failedModuleResponse);

    jest
      .spyOn(ForumRepository.prototype, 'fetchAll')
      .mockResolvedValueOnce([]);

    jest
      .spyOn(ForumRepository.prototype, 'count')
      .mockResolvedValueOnce(0);

    const healthyModuleResponse = await request(app)
      .get('/api/forum')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });

  test('si falla tutorial, users sigue respondiendo', async () => {
    jest
      .spyOn(TutorialRepository.prototype, 'getByPage')
      .mockRejectedValueOnce(new Error('RNF05 simulated tutorial failure'));

    const failedModuleResponse = await request(app)
      .get('/api/tutorial')
      .query({ page: 'dashboard' });

    expectControlledResponse(failedModuleResponse);

    const healthyModuleResponse = await request(app)
      .get('/users')
      .query({ page: 1, limit: 6 });

    expect(healthyModuleResponse.status).toBe(200);
    expect(healthyModuleResponse.body).toBeDefined();
  });
});