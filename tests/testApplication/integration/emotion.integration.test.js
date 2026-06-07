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

const mockExecute = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/getEmotionResultUseCase', () =>
  jest.fn().mockImplementation(() => ({
    execute: mockExecute,
  }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });


const BASE_URL = (idUser, idApp, idResults) =>
  `/api/users/${idUser}/applications/${idApp}/tests/6/results/${idResults}`;

const validDTO = () => ({
  idResults:           'r-1',
  idTest:              6,
  status:              'completed',
  dateApplied:         '2024-01-15',
  scoreAnxietyBeck:    10,
  interAnxietyBeck:    'Mild',
  scoreDepressionBeck: 14,
  interDepressionBeck: 'Mild',
  notes:               'No observations',
});


describe('INTEGRATION — GET /api/users/:id_user/applications/:id_application/tests/6/results/:id_results', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'authenticated';
  });


  test('1.1 returns 200 with the DTO when the result exists', async () => {
    mockExecute.mockResolvedValue(validDTO());

    const res = await request(app).get(BASE_URL(1, 10, 'r-1'));

    expect(res.status).toBe(200);
    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(res.body.data.idResults).toBe('r-1');
    expect(res.body.data.idTest).toBe(6);
    expect(res.body.data.status).toBe('completed');
    expect(res.body.data.scoreAnxietyBeck).toBe(10);
    expect(res.body.data.scoreDepressionBeck).toBe(14);
  });

  test('1.2 returns 200 with dateApplied and notes set to null when they are not present', async () => {
    mockExecute.mockResolvedValue({
      ...validDTO(),
      dateApplied: null,
      notes: null,
    });

    const res = await request(app).get(BASE_URL(1, 10, 'r-2'));

    expect(res.status).toBe(200);
    expect(res.body.data.dateApplied).toBeNull();
    expect(res.body.data.notes).toBeNull();
  });


  test('2.1 returns 404 when the use case throws an error with status 404', async () => {
    const err = new Error('Emotion result not found');
    err.status = 404;
    mockExecute.mockRejectedValue(err);

    const res = await request(app).get(BASE_URL(1, 10, 'non-existent'));

    expect(res.status).toBe(404);
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });


  test('3.1 returns 500 when the use case throws an unexpected error', async () => {
    mockExecute.mockRejectedValue(new Error('DB connection failed'));

    const res = await request(app).get(BASE_URL(1, 10, 'r-1'));

    expect(res.status).toBe(500);
  });


  test('4.1 redirects to /auth/ when the session has expired', async () => {
    mockAuthBehavior = 'unauthenticated';

    const res = await request(app).get(BASE_URL(1, 10, 'r-1'));

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
    expect(mockExecute).not.toHaveBeenCalled();
  });


  test('5.1 passes the correct id_results to the use case', async () => {
    mockExecute.mockResolvedValue(validDTO());

    await request(app).get(BASE_URL(1, 10, 'r-99'));

    expect(mockExecute).toHaveBeenCalledWith(
      expect.objectContaining({ id_results: 'r-99' })
    );
  });
});