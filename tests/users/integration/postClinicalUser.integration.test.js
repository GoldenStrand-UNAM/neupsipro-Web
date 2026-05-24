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
    }
  }))
);

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
  jest.fn(() => ({
    requirePermission: () => (req, res, next) => next()
  }))
);

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter: (req, res, next) => next(),
  generalLimiter: (req, res, next) => next(),
  apiLimiter: (req, res, next) => next(),
  publicationLimiter: (req, res, next) => next(),
  userLimiter: (req, res, next) => next(),
}));

const mockExecute = jest.fn();

jest.mock('../../../Back/src/application/usecase/users/postClinicalUserUseCase', () =>
  jest.fn().mockImplementation(() => ({
    execute: mockExecute
  }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

const validBody = () => ({
  idRole: 3,
  firstName: 'Maria',
  lastnameP: 'Gomez',
  lastnameM: 'Lopez',
  birthdate: '01/01/1990',
  email: 'maria@example.com',
  affiliation: 'UNAM',
  activity: 'Fisioterapia',
  startDate: '01/01/2024',
  finishDate: '01/01/2027',
  hours: 40,
  username: 'mgomez',
  password: '123456',
  emergencyContactName: 'Pedro Gomez',
  emergencyContactPhone: '5551234567',
  emergencyContactRelation: 'Padre'
});

test('renders post clinical user form', async () => {
  const res = await request(app).get('/clinical/postUser');
  expect(res.status).toBe(200);
});

describe('INTEGRATION — POST /clinical/postUser', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'authenticated';
  });

  test('creates clinical user successfully', async () => {
    mockExecute.mockResolvedValue({ idUser: 'c-001' });

    const res = await request(app).post('/clinical/post').send(validBody());

    expect(res.status).toBe(201);
    expect(mockExecute).toHaveBeenCalled();
  });

  test('returns 400 when user is duplicated', async () => {
    mockExecute.mockRejectedValue(new Error('El usuario ya se encuentra registrado.'));

    const res = await request(app).post('/clinical/post').send(validBody());

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('El usuario ya se encuentra registrado');
  });

  test('returns 400 when start date is invalid', async () => {
    mockExecute.mockRejectedValue(new Error('La fecha de inicio no es válida'));

    const body = validBody();
    body.startDate = 'fecha-invalida';

    const res = await request(app).post('/clinical/post').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('fecha de inicio');
  });

  test('returns 400 when finish date is invalid', async () => {
    mockExecute.mockRejectedValue(new Error('La fecha de fin no es válida'));

    const body = validBody();
    body.finishDate = 'no-es-fecha';

    const res = await request(app).post('/clinical/post').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('fecha de fin');
  });

  test('returns 400 when usecase throws (validation error)', async () => {
    mockExecute.mockRejectedValue(new Error('El nombre debe llenarse'));

    const body = validBody();
    body.firstName = '';

    const res = await request(app).post('/clinical/post').send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('redirects to login if session expired', async () => {
    mockAuthBehavior = 'unauthenticated';

    const res = await request(app).post('/clinical/post').send(validBody());

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  });
});