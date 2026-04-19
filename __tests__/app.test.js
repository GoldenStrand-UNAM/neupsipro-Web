/* global describe, test, expect, jest */
require('dotenv').config({ path: './.env.test' });
const request = require('supertest');

jest.mock('../Back/src/infrastructure/database/database', () => {
    const mock = {
        execute: jest.fn().mockResolvedValue([[]]),
        query: jest.fn().mockResolvedValue([[]]),
        getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }),
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(null),
    };
    return mock;
});

jest.mock('../Back/src/infrastructure/external/memoryCache.service', () => {
    return jest.fn().mockImplementation(() => ({
        getAttempts: jest.fn().mockReturnValue(0),
        incrementAttempts: jest.fn(),
        clearAttempts: jest.fn()
    }));
});

const app = require('../Back/src/app');

describe('Pruebas de Integración - App.js', () => {
    
    afterAll(async () => {
        jest.useRealTimers();
    });

    test('Manejo de rutas no encontradas (404)', async () => {
        const response = await request(app).get('/api/ruta-inexistente');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Ruta no encontrada' });
    });

    test('GET /test - Renderizado Mockeado', async () => {
        jest.spyOn(app.response, 'render').mockImplementation(function(view) {
            return this.send(`Rendered ${view}`);
        });

        const response = await request(app).get('/test');
        expect(response.status).toBe(200);
    });

    test('CORS Header presente', async () => {
        const response = await request(app).get('/test');
        expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
});