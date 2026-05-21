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

const mockExecuteWais = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/postWAISUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteWais }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const url = '/api/users/1/applications/app-001/tests/2/results';

const validBody = () => ({
  score_com_verbal:       105,
  score_razon_perceptual: 110,
  score_mem_work:          95,
  score_velo_proce:       100,
  score_total:            103,
  notes: 'Resultados consistentes con escolaridad.',
});

const successDTO = {
  idResults: 'r-002', idTest: 2, status: 3,
  areas: {
    comVerbal:       { score: 105, interpretation: 'Promedio alto' },
    razonPerceptual: { score: 110, interpretation: 'Promedio alto' },
    memWork:         { score:  95, interpretation: 'Promedio' },
    veloProce:       { score: 100, interpretation: 'Promedio' },
  },
  scoreTotal: 103, interTotal: 'Promedio', notes: 'OK',
};

// ===================== TESTS =============================================

describe('INTEGRATION — POST /api/users/:id_user/applications/:id_application/tests/2/results · WAIS (R01 / R04)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 2xx with valid area scores (Registrar)', async () => {
    mockExecuteWais.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send(validBody());

    expect([200, 201]).toContain(res.status);
    expect(mockExecuteWais).toHaveBeenCalledTimes(1);
  });

  test('base — responds 2xx when re-saving with new scores (Modificar)', async () => {
    mockExecuteWais.mockResolvedValue(successDTO);

    const res = await request(app).post(url).send({
      score_com_verbal:       100,
      score_razon_perceptual: 105,
      score_mem_work:          90,
      score_velo_proce:        95,
      score_total:             98,
      notes: 'Re-evaluado.',
    });

    expect([200, 201]).toContain(res.status);
  });

  // 1.1 — SQL passes through as plain string; parameterised queries prevent injection.
  test('1.1 accepts SQL injection in notes as plain string', async () => {
    mockExecuteWais.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: "'; DROP TABLE wais_results; --" });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  // 1.2 — XSS passes through as plain string; neutralised at render time via EJS escaping.
  test('1.2 accepts an XSS payload in notes as plain string', async () => {
    mockExecuteWais.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: '<script>alert(document.cookie)</script>' });

    expect([200, 201]).toContain(res.status);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  // 1.3 — Emojis: accepted (200/201) or sanitised (400).
  test('1.3 handles emojis in notes without internal errors', async () => {
    mockExecuteWais.mockResolvedValue(successDTO);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), notes: 'Resultados óptimos 😊🧠✅' });

    expect([200, 201, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('responds 422 when an area score is non-numeric', async () => {
    const err = new Error('score_com_verbal must be a valid number');
    err.status = 422;
    mockExecuteWais.mockRejectedValue(err);

    const res = await request(app)
      .post(url)
      .send({ ...validBody(), score_com_verbal: 'abc' });

    expect(res.status).toBe(422);
    expect(res.text).not.toContain('stack');
  });

  test('responds 404 when the result row does not exist', async () => {
    const err = new Error('Test result row not found');
    err.status = 404;
    mockExecuteWais.mockRejectedValue(err);

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