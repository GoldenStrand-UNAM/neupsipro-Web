const request = require('supertest');
const app = require('../../../Back/src/app');



// Check users Endpoint
describe('GET /usuarios', () => {
  test('retorna status 200', async () => {
    const response = await request(app).get('/usuarios');
    expect(response.status).toBe(200);
  });
});

// XSS security test
describe('Reflected XSS', () => {

  // A <script> tag in the query string should never appear unescaped in the HTML
  test('script payload should not be returned as raw HTML', async () => {
    const payload = '<script>alert(1)</script>';
    const res = await request(app)
      .get('/api/usuarios')
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
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });

});

describe('SQL Injection', () => {

  // Injection payload should not break or alter query behavior
  test('SQL injection payload should not affect quer', async () => {
    const payload = "' OR '1'='1";
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.status).toBe(200);
  });


  // Normal search should still work correctly
  test('valid search should not be affected by malicious inputs ', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: 'Juan', page: 1, limit: 6 });

    expect(res.status).toBe(200);

  });

});

describe('rate limiting', () => {
  test('should limit the number of requests', async () => {
    for (let i = 0; i < 1000; i++) {
      await request(app).get('/api/usuarios').query({ search: '', page: 1, limit: 6 });
    }
    const res = await request(app).get('/api/usuarios').query({ search: '', page: 1, limit: 6 });
    expect(res.status).toBe(429);
  });
}
);


// Input validation tests
describe('input length validation', () => {

  // Search should not accept more than 100 characters
  test('search query should be limited to 100 characters', async () => {

    // Create a string longer than 100 characters
    const payload = 'a'.repeat(101);

    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    // Expect request to be rejected
    expect(res.status).toBe(429);

  });

});



