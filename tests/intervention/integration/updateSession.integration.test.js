const request = require('supertest');

// ===================== MOCKS =============================================

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
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

const mockExecuteUpdate = jest.fn();

jest.mock('../../../Back/src/application/usecase/interventions/updateSessionUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteUpdate }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const validSessionBody = () => ({
  session_number : 1,
  session_date   : '2024-06-01',
  objectives     : 'Assess the patient initial state',
  development    : 'A structured clinical interview was conducted',
  dqp_task       : 'Complete the anxiety questionnaire',
});

// ===================== TESTS =============================================

describe('INTEGRATION — PATCH /users/:id_user/intervention/sessions/:id_session · session update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 200 with valid session update data', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true, message: 'Sesión actualizada' });

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send(validSessionBody());

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
  });

  test('accepts an image data-URI in objectives as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true, message: 'Sesión actualizada' });

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send({ ...validSessionBody(), objectives: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });

  test('accepts SQL injection-like payload in development as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true, message: 'Sesión actualizada' });

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send({ ...validSessionBody(), development: "'; DROP TABLE intervention_session; --" });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  test('accepts XSS payload in dqp_task as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true, message: 'Sesión actualizada' });

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send({ ...validSessionBody(), dqp_task: '<script>alert("xss")</script>' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  test('handles emojis in session fields without internal errors', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true, message: 'Sesión actualizada' });

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send({
        ...validSessionBody(),
        objectives: 'Revisión de sesión 😊',
        development: 'Excelente progreso 🧠',
      });

    expect([200, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('redirects to /auth/ when there is no active session', async () => {
    asUnauthenticated();

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send(validSessionBody());

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  });

  test('responds 400 when the update use case throws an error', async () => {
    mockExecuteUpdate.mockRejectedValue(new Error('No existe intervención activa'));

    const res = await request(app)
      .patch('/users/1/intervention/sessions/1')
      .send(validSessionBody());

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'No existe intervención activa');
    expect(res.text).not.toContain('stack');
  });
});
