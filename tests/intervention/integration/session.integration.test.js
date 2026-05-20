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

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);

const mockExecuteAdd = jest.fn();

jest.mock('../../../Back/src/application/usecase/interventions/addSessionUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteAdd }))
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

describe('INTEGRATION — POST /users/:id_user/intervention/sessions · session inputs (cases 7.x)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 201 with valid session data', async () => {
    mockExecuteAdd.mockResolvedValue({ success: true, idSession: 1 });

    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send(validSessionBody());

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('success', true);
  });

  // 7.1 — No router-level validation; data-URIs pass through as plain strings (201).
  test('7.1 accepts an image data-URI in objectives as plain string', async () => {
    mockExecuteAdd.mockResolvedValue({ success: true, idSession: 2 });

    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send({ ...validSessionBody(), objectives: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' });

    expect(res.status).toBe(201);
    expect(res.text).not.toContain('stack');
  });

  // 7.2 — SQL passes through as plain string (201); parameterised queries prevent injection.
  test('7.2 accepts SQL injection in objectives as plain string', async () => {
    mockExecuteAdd.mockResolvedValue({ success: true, idSession: 4 });
 
    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send({ ...validSessionBody(), objectives: "'; DROP TABLE intervention_session; --" });
 
    expect(res.status).toBe(201);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });


  // 7.4 — XSS passes through as plain string (201); neutralised at render time via EJS escaping.
  test('7.4 accepts an XSS script payload in development as plain string', async () => {
    mockExecuteAdd.mockResolvedValue({ success: true, idSession: 9 });
 
    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send({ ...validSessionBody(), development: '<script>window.location="https://evil.com"</script>' });
 
    expect(res.status).toBe(201);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

    // 7.5 — Emojis: accepted (201) or sanitised (400).
  test('7.5 handles emojis in session fields without internal errors', async () => {
    mockExecuteAdd.mockResolvedValue({ success: true, idSession: 11 });
 
    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send({
        ...validSessionBody(),
        objectives : 'Assess emotional state 😊 of the patient 🧠',
        development: 'Smooth session ✅ with active participation 💬',
      });
 
    expect([201, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });
 
  test('redirects to /auth/ when there is no active session', async () => {
    asUnauthenticated();
 
    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send(validSessionBody());
 
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  });
 
  test('responds 400 when no active intervention exists for the user', async () => {
    mockExecuteAdd.mockRejectedValue(new Error('No active intervention found'));
 
    const res = await request(app)
      .post('/users/1/intervention/sessions')
      .send(validSessionBody());
 
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.text).not.toContain('stack');
  });
 



});