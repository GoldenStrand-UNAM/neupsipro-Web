/* global describe, test, expect */
const request = require('supertest');
const app = require('../Back/src/app');

describe('Pruebas de Integración - Autenticación y Vistas', () => {
    describe('GET /test', () => {
        test('debería renderizar la vista de test con status 200', async () => {
            const response = await request(app).get('/test');
            expect(response.status).toBe(200);
            expect(response.header['content-type']).toMatch(/text\/html/);
        });
    });

    describe('POST /auth/logout', () => {
        test('deberia responder correctamente al cerrar sesión', async () => {
            const response = await request(app)
                .post('/auth/logout')
                .send({ token: 'algun-token-falso' });
            expect(response.status).not.toBe(404);
        });
    });

    describe('Manejo de errores globales', () => {
        test('retorna 404 oara una ruta que no existe en mi sistema', async () => {
            const response = await request(app).get('/api/ruta-inexistente');
            expect(response.status).toBe(404);
        });
    });
});