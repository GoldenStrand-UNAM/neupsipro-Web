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

const mockExecuteRey = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/postREYUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteRey }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const url = '/api/users/1/applications/app-001/tests/3/results';

const validBody = () => ({
  score_rc:  32, time_rc:  4,
  score_mcp: 20, time_mcp: 3,
  score_mlp: 18, time_mlp: 3,
  notes: 'Memoria visual conservada.',
});

const successDTO = {
  idResults: 'r-003', idTest: 3, status: 3,
  rc:  { score: 32, pc: 50, time: 4, pcTime: 50 },
  mcp: { score: 20, pc: 50, time: 3, pcTime: 50 },
  mlp: { score: 18, pc: 50, time: 3, pcTime: 50 },
  notes: 'OK',
};

// ===================== TESTS =============================================

describe('INTEGRATION — POST /api/users/:id_user/applications/:id_application/tests/3/results · REY (R01 / R04)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 2xx with valid scores and times (Registrar)', async () => {
    mockExecuteRey.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send(validBody());

    expect([200, 201]).toContain(res.status);
    expect(mockExecuteRey).toHaveBeenCalledTimes(1);
  });

  test('base — responds 2xx when re-saving with new scores (Modificar)', async () => {
    mockExecuteRey.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send({
      score_rc:  30, time_rc:  5,
      score_mcp: 18, time_mcp: 4,
      score_mlp: 16, time_mlp: 4,
      notes: 'Re-evaluado.',
    });

    expect([200, 201]).toContain(res.status);
  });

  // 1.1 — SQL passes through as plain string; parameterised queries prevent injection.
  test('1.1 accepts SQL injection in notes as plain string', async () => {
    mockExecuteRey.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: "'; DROP TABLE rey_results; --" });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  // 1.2 — XSS passes through as plain string; neutralised at render time via EJS escaping.
  test('1.2 accepts an XSS payload in notes as plain string', async () => {
    mockExecuteRey.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: '<script>alert(document.cookie)</script>' });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  // 1.3 — Emojis: accepted (200/201) or sanitised (400).
  test('1.3 handles emojis in notes without internal errors', async () => {
    mockExecuteRey.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: 'Buen desempeño 😊🧠✅' });

    expect([200, 201, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('responds 422 when a score is negative', async () => {
    const err = new Error('score_rc must be a non-negative number');
    err.status = 422;
    mockExecuteRey.mockRejectedValue(err);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), score_rc: -1 });

    expect(res.status).toBe(422);
    expect(res.text).not.toContain('stack');
  });

  test('responds 404 when the result row does not exist', async () => {
    const err = new Error('Test result row not found');
    err.status = 404;
    mockExecuteRey.mockRejectedValue(err);

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