const request = require('supertest');
const app = require('../Back/src/app');



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
  test('payload <script> no debe aparecer sin escapar en la respuesta', async () => {
    const payload = '<script>alert(1)</script>';
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('<script>alert(1)</script>');
  });

  // img test
  test('payload img onerror tampoco debe pasar', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });

});

describe('SQL Injection', () => {
  test('payload SQL Injection no debe afectar la consulta', async () => {
    const payload = "' OR '1'='1";
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.status).toBe(200);
  });

  test('busqueda legítima no debe ser afectada por payloads maliciosos', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: 'Juan', page: 1, limit: 6 });

    expect(res.status).toBe(200);

  });

});

describe('rate limiting', () => {
  test('debería limitar el número de solicitudes', async () => {
    for (let i = 0; i < 1000; i++) {
      await request(app).get('/api/usuarios').query({ search: '', page: 1, limit: 6 });
    }
    const res = await request(app).get('/api/usuarios').query({ search: '', page: 1, limit: 6 });
    expect(res.status).toBe(429);
  });
}
);






