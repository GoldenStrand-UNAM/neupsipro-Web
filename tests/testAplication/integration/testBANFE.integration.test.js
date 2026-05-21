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

const mockExecuteBanfe = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/postBANFEUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteBanfe }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const url = '/api/users/1/applications/app-001/tests/1/results';

const validBody = () => ({
  score_orbit_frontal:     95,
  score_prefrontal_before: 100,
  score_d_lateral:          90,
  notes: 'Resultados dentro del rango normal.',
});

const successDTO = {
  idResults: 'r-001', idTest: 1, status: 3,
  areas: {
    orbitFrontal:     { score: 95,  interpretation: 'Normal' },
    prefrontalBefore: { score: 100, interpretation: 'Normal' },
    dLateral:         { score: 90,  interpretation: 'Normal' },
  },
  scoreTotal: 285, notes: 'OK',
};

// ===================== TESTS =============================================

describe('INTEGRATION — POST /api/users/:id_user/applications/:id_application/tests/1/results · BANFE (R01 / R04)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 2xx with valid area scores (Registrar)', async () => {
    mockExecuteBanfe.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send(validBody());

    expect([200, 201]).toContain(res.status);
    expect(mockExecuteBanfe).toHaveBeenCalledTimes(1);
  });

  test('base — responds 2xx when re-saving with new scores (Modificar)', async () => {
    mockExecuteBanfe.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send({
      score_orbit_frontal:     85,
      score_prefrontal_before:  90,
      score_d_lateral:          80,
      notes: 'Re-evaluado tras revisión clínica.',
    });

    expect([200, 201]).toContain(res.status);
  });

  // 1.1 — SQL passes through as plain string; parameterised queries prevent injection.
  test('1.1 accepts SQL injection in notes as plain string', async () => {
    mockExecuteBanfe.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: "'; DROP TABLE banfe_results; --" });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  // 1.2 — XSS passes through as plain string; neutralised at render time via EJS escaping.
  test('1.2 accepts an XSS payload in notes as plain string', async () => {
    mockExecuteBanfe.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: '<script>alert(document.cookie)</script>' });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  // 1.3 — Emojis: accepted (200/201) or sanitised (400).
  test('1.3 handles emojis in notes without internal errors', async () => {
    mockExecuteBanfe.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: 'Resultados óptimos 😊🧠✅' });

    expect([200, 201, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('responds 422 when an area score is negative', async () => {
    const err = new Error('score_orbit_frontal must be a non-negative number');
    err.status = 422;
    mockExecuteBanfe.mockRejectedValue(err);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), score_orbit_frontal: -5 });

    expect(res.status).toBe(422);
    expect(res.text).not.toContain('stack');
  });

  test('responds 404 when the result row does not exist', async () => {
    const err = new Error('Test result row not found');
    err.status = 404;
    mockExecuteBanfe.mockRejectedValue(err);

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