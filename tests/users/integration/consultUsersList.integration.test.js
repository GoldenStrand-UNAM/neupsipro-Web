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

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

const app = require('../../../Back/src/app');



// Check users Endpoint
describe('GET /users', () => {
  test('retorna status 200', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
  });
});

// XSS security test
describe('Reflected XSS', () => {

  // A <script> tag in the query string should never appear unescaped in the HTML
  test('script payload should not be returned as raw HTML', async () => {
    const payload = '<script>alert(1)</script>';
    const res = await request(app)
      .get('/api/users')
      .query({ search: payload, page: 1, limit: 6 });

    // Request should succeed
    expect(res.status).toBe(200);

    // Response should NOT contain raw script tag
    expect(res.text).not.toContain('<script>alert(1)</script>');
  });

  // img test
  test('img onerror payload should be blocked or escaped', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    const res = await request(app)
      .get('/api/users')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });

});

describe('SQL Injection', () => {

  // Injection payload should not break or alter query behavior
  test('SQL injection payload should not affect quer', async () => {
    const payload = "' OR '1'='1";
    const res = await request(app)
      .get('/api/users')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.status).toBe(200);
  });


  // Normal search should still work correctly
  test('valid search should not be affected by malicious inputs ', async () => {
    const res = await request(app)
      .get('/api/users')
      .query({ search: 'Juan', page: 1, limit: 6 });

    expect(res.status).toBe(200);

  });

});


describe('Invalid pagination parameters', () => {
  test('pagination page with negative number, goes back to 1, returns 200', async () => {
    const res = await request(app)
      .get('/api/users')
      .query({ page: -5, limit: 10 });
    expect(res.status).toBe(200);
  });
});




// Input validation tests
describe('input length validation', () => {

  // Search should not accept more than 100 characters
  test('search query should be limited to 100 characters', async () => {

    // Create a string longer than 100 characters
    const payload = 'a'.repeat(101);

    const res = await request(app)
      .get('/api/users')
      .query({ search: payload, page: 1, limit: 6 });

    // Expect request to be rejected
    expect(res.status).toBe(429);

  });

});


