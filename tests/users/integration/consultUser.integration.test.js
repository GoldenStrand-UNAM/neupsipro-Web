const request = require('supertest');

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next();
    }
  }));
});

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next()
  }));
});

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => {
  return () => (req, res, next) => next();
});

const app = require('../../../Back/src/app');

// Endpoint base (U-001 must exist)
describe('GET /users/:id_user ', () => {
  test('returns status 200 with existing user (u-001)', async () => {
    const res = await request(app).get('/users/u-001');
    expect(res.status).toBe(200);
  });

  test('returns status 400 when user is not found', async () => {
    const res = await request(app).get('/users/u-999');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Usuario no encontrado');
  });
});

// XSS injection
describe('Reflected XSS en /users/:id_user', () => {
  test('payload <script> no debe regresar como HTML crudo', async () => {
    const payload = '<script>alert(1)</script>';
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect(res.text).not.toContain('<script>alert(1)</script>');
  });

  test('img onerror', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });
});

// SQL Injection 
describe('SQL Injection en /users/:id_user', () => {
  test('payload OR 1=1', async () => {
    const payload = "u-001' OR '1'='1";
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect(res.status).toBe(400);
  });

  test('payload UNION SELECT', async () => {
    const payload = "u-001 UNION SELECT * FROM users";
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect(res.status).toBe(400);
  });

  test('payload DROP TABLE', async () => {
    const payload = "u-001; DROP TABLE users;--";
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect([400, 200]).toContain(res.status);
  });
});

// Validation "don quijote"
describe('Validación de id_user', () => {
  test('very large id', async () => {
    const payload = 'EnAlgunLugarDeLaMancha'.repeat(500);
    const res = await request(app).get(`/users/${payload}`);
    expect([400, 414, 429, 431]).toContain(res.status);
  });
});

// Directory Traversal
describe('Path Directory Traversal /users/:id_user', () => {
  test('Directory Traversal', async () => {
    const payload = '../../etc/passwd';
    const res = await request(app).get(`/users/${encodeURIComponent(payload)}`);
    expect([400, 404]).toContain(res.status);
  });
});