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

const mockExecuteNih = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/postNihUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteNih }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const url = '/api/users/1/applications/app-001/tests/5/results';

const validBody = () => ({ notes: 'Paciente colaborador, sin observaciones.' });

const successDTO = {
  idResults: 'r-005', idTest: 5, status: 3,
  dateApplied: '2026-05-20', notes: 'Paciente colaborador.',
};

// ===================== TESTS =============================================

describe('INTEGRATION — POST /api/users/:id_user/applications/:id_application/tests/5/results · NIH (R01 / R04)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 2xx with valid notes (Registrar)', async () => {
    mockExecuteNih.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send(validBody());

    expect([200, 201]).toContain(res.status);
    expect(mockExecuteNih).toHaveBeenCalledTimes(1);
  });

  test('base — responds 2xx when re-saving with new notes (Modificar)', async () => {
    mockExecuteNih.mockResolvedValue({ ...successDTO, notes: 'Notas actualizadas.' });

    const res = await request(app)
      .post(url)
      .send({ notes: 'Notas actualizadas tras segunda revisión.' });

    expect([200, 201]).toContain(res.status);
  });

  // 1.1 — SQL passes through as plain string; parameterised queries prevent injection.
  test('1.1 accepts SQL injection in notes as plain string', async () => {
    mockExecuteNih.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ notes: "'; DROP TABLE test_results; --" });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  // 1.2 — XSS passes through as plain string; neutralised at render time via EJS escaping.
  test('1.2 accepts an XSS payload in notes as plain string', async () => {
    mockExecuteNih.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ notes: '<script>alert(document.cookie)</script>' });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  // 1.3 — Emojis: accepted (200/201) or sanitised (400).
  test('1.3 handles emojis in notes without internal errors', async () => {
    mockExecuteNih.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ notes: 'dwadawdadw dwaawdawd 😊🧠✅' });

    expect([200, 201, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('responds 422 when notes longer than 500 chars', async () => {
    const err = new Error('notes must be 500 characters or less');
    err.status = 422;
    mockExecuteNih.mockRejectedValue(err);

    const res = await request(app).post(url).send({ notes: 'a'.repeat(501) });

    expect(res.status).toBe(422);
    expect(res.text).not.toContain('stack');
  });

  test('responds 404 when the result row does not exist', async () => {
    const err = new Error('Test result row not found');
    err.status = 404;
    mockExecuteNih.mockRejectedValue(err);

    const res = await request(app).post(url).send(validBody());

    expect(res.status).toBe(404);
    expect(res.text).not.toContain('stack');
  });

  test('redirects to /auth/ when there is no active session', async () => {
    asUnauthenticated();

    const res = await request(app).post(url).send(validBody());

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  });
});