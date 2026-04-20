const request = require('supertest');
const app = require('../Back/src/app');



describe('GET /usuarios', () => {
  test('retorna status 200', async () => {
    const response = await request(app).get('/usuarios');
    expect(response.status).toBe(200);
  });
});

describe('V0 - Reflected XSS (walkthrough)', () => {
  test('payload <script> no debe aparecer sin escapar en la respuesta', async () => {
    const payload = '<script>alert(1)</script>';
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.status).toBe(200);
    expect(res.text).not.toContain('<script>alert(1)</script>');
  });

  test('payload img onerror tampoco debe pasar', async () => {
    const payload = '<img src=x onerror=alert(1)>';
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: payload, page: 1, limit: 6 });

    expect(res.text).not.toContain('<img src=x onerror=alert(1)>');
  });

  test('mensaje legítimo (texto plano) sigue mostrándose', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .query({ search: 'maria garcia', page: 1, limit: 6 });

    expect(res.status).toBe(200);
    expect(res.text).toContain('maria garcia');
  });
});