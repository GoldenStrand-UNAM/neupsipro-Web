const request = require('supertest');

jest.mock('../../Back/src/infrastructure/auth/auth.middleware', () => jest.fn().mockImplementation(() => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 1, role: 'admin' };
    next();
  },
})));

jest.mock('../../Back/src/infrastructure/auth/permissions.middleware', () => jest.fn().mockImplementation(() => ({
  requirePermission: () => (req, res, next) => next(),
})));

jest.mock('../../Back/src/infrastructure/external/rateLimiting', () => ({
  generalLimiter: (req, res, next) => next(),
  loginLimiter: (req, res, next) => next(),
}));

const ForumRepository = require('../../Back/src/infrastructure/repositories/ImpForumRepository');

// Mock manual porque el método no existe en la implementación actual
ForumRepository.prototype.fetchOneUser = jest.fn();

const app = require('../../Back/src/app');

describe('Publication Detail: GET /forum/publication/id ', () => {

  // Check Endpoint
  describe('GET /publication/:id', () => {

    test('retorn status 200', async () => {

      ForumRepository.prototype.fetchOneUser.mockResolvedValueOnce([
        [{
          id_publication: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Test',
          content: 'Test',
          profile_photo: null,
          image: null,
        }],
      ]);

      const response = await request(app).get('/publication/1');

      expect(response.status).toBe(200);
    });
  });

  test('returns 500 when server fails to get the publication', async () => {

    ForumRepository.prototype.fetchOneUser
      .mockRejectedValueOnce(new Error('DB Error'));

    const res = await request(app).get('/publication/1');

    expect(res.status).toBe(500);
  });

  test('When the publication is not found', async () => {

    ForumRepository.prototype.fetchOneUser
      .mockResolvedValueOnce([[]]);

    const res = await request(app).get('/publication/999999999');

    expect(res.status).toBe(404);
    expect(res.body.dto.success).toBe(false);
  });

});

// Validation "don quijote"
describe('Validación de id_user', () => {

  test('very large id', async () => {

    const payload = 'EnAlgunLugarDeLaMancha'.repeat(500);

    const res = await request(app).get(`/publication/${payload}`);

    expect([400, 404, 414, 429, 431, 500]).toContain(res.status);
  });
});

// Directory Traversal
describe('Path Directory Traversal /users/:id_user', () => {

  test('Directory Traversal', async () => {

    const payload = '../../etc/passwd';

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect([400, 404, 500]).toContain(res.status);
  });
});

// SQL Injection
describe('SQL Injection en /publication/:id_publication', () => {

  test('payload OR 1=1', async () => {

    const payload = "u-001' OR '1'='1";

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect([400, 404, 500]).toContain(res.status);
  });

  test('payload UNION SELECT', async () => {

    const payload = 'u-001 UNION SELECT * FROM users';

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect([400, 404, 500]).toContain(res.status);
  });

  test('payload DROP TABLE', async () => {

    const payload = 'u-001; DROP TABLE users;--';

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect([400, 404, 500]).toContain(res.status);
  });
});

// XSS injection
describe('Reflected XSS en /publication/:id_publication', () => {

  test('payload <script> no debe regresar como HTML crudo', async () => {

    const payload = '<script>alert(1)</script>';

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect(res.text).not.toContain('<script>alert(1)</script>');
  });

  test('img onerror', async () => {

    const payload = '<img src=x onerror=alert(1)>';

    const res = await request(app).get(`/publication/${encodeURIComponent(payload)}`);

    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });
});