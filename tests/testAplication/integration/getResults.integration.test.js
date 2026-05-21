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
const mockExecuteWais  = jest.fn();
const mockExecuteRey   = jest.fn();
const mockExecuteMoca  = jest.fn();
const mockExecuteNih   = jest.fn();

jest.mock('../../../Back/src/application/usecase/testApplications/getBANFEUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteBanfe }))
);
jest.mock('../../../Back/src/application/usecase/testApplications/getWAISUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteWais }))
);
jest.mock('../../../Back/src/application/usecase/testApplications/getREYUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteRey }))
);
jest.mock('../../../Back/src/application/usecase/testApplications/getMOCAUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteMoca }))
);
jest.mock('../../../Back/src/application/usecase/testApplications/getNIHUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteNih }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const ROUTES = [
  { name: 'BANFE', idTest: 1, mockExecute: mockExecuteBanfe, dto: { idResults: 'r-001', idTest: 1, status: 3 } },
  { name: 'WAIS',  idTest: 2, mockExecute: mockExecuteWais,  dto: { idResults: 'r-002', idTest: 2, status: 3 } },
  { name: 'REY',   idTest: 3, mockExecute: mockExecuteRey,   dto: { idResults: 'r-003', idTest: 3, status: 3 } },
  { name: 'MOCA',  idTest: 4, mockExecute: mockExecuteMoca,  dto: { idResults: 'r-004', idTest: 4, status: 3 } },
  { name: 'NIH',   idTest: 5, mockExecute: mockExecuteNih,   dto: { idResults: 'r-005', idTest: 5, status: 3 } },
];

const urlFor = (idTest, idResults = 'r-001') =>
  `/api/users/1/applications/app-001/tests/${idTest}/results/${idResults}`;

// ===================== TESTS =============================================

describe.each(ROUTES)(
  'INTEGRATION — GET /api/users/:id_user/.../tests/$idTest/results/:idResults · $name (Consultar)',
  (cfg) => {
    beforeEach(() => {
      jest.clearAllMocks();
      asAuthenticated();
    });

    test('base — responds 200 with valid result data', async () => {
      cfg.mockExecute.mockResolvedValue(cfg.dto);

      const res = await request(app).get(urlFor(cfg.idTest));

      expect(res.status).toBe(200);
      expect(cfg.mockExecute).toHaveBeenCalledTimes(1);
    });

    // Auth — the route must be behind verifyToken.
    test('redirects to /auth/ when there is no active session', async () => {
      asUnauthenticated();

      const res = await request(app).get(urlFor(cfg.idTest));

      expect(res.status).toBe(302);
      expect(res.header.location).toBe('/auth/');
    });

    // 404 — no information leak when the result does not exist.
    test('responds 404 when the result row does not exist', async () => {
      const err = new Error(`${cfg.name} result not found`);
      err.status = 404;
      cfg.mockExecute.mockRejectedValue(err);

      const res = await request(app).get(urlFor(cfg.idTest));

      expect(res.status).toBe(404);
      expect(res.text).not.toContain('stack');
    });

    // SQL injection in path param — parameterised queries prevent injection.
    test('accepts SQL injection in idResults path param without 500', async () => {
      cfg.mockExecute.mockResolvedValue(cfg.dto);

      const maliciousId = encodeURIComponent("'; DROP TABLE test_results; --");
      const res = await request(app).get(urlFor(cfg.idTest, maliciousId));

      expect(res.status).not.toBe(500);
      expect(res.text).not.toContain('DROP');
      expect(res.text).not.toContain('stack');
    });

    // API contract — response is JSON, not server-rendered HTML.
    test('responds with JSON content type', async () => {
      cfg.mockExecute.mockResolvedValue(cfg.dto);

      const res = await request(app).get(urlFor(cfg.idTest));

      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    // No information leak on unexpected errors — generic 500, no internal details.
    test('does not leak stack traces or internal messages on 500', async () => {
      cfg.mockExecute.mockRejectedValue(new Error('DB connection lost: secret host 10.0.0.42'));

      const res = await request(app).get(urlFor(cfg.idTest));

      expect(res.status).toBe(500);
      expect(res.text).not.toContain('stack');
      expect(res.text).not.toContain('DB connection');
      expect(res.text).not.toContain('10.0.0.42');
    });
  }
);