/* global describe, test, expect, jest */
require('dotenv').config({ path: './.env.test' }); // Cargar variables antes que nada
const request = require('supertest');

// 1. MOCK DE DATABASE (Antes de cargar app)
jest.mock('../Back/src/infrastructure/database/database', () => {
    const mock = {
        execute: jest.fn().mockResolvedValue([[]]),
        query: jest.fn().mockResolvedValue([[]]),
        getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }),
        on: jest.fn(),
        end: jest.fn().mockResolvedValue(null),
    };
    // Forzamos que el mock sea lo que devuelve pool.promise()
    return mock;
});

// 2. MOCK DE MEMORY CACHE (Para evitar los setTimeouts de 15 min)
jest.mock('../Back/src/infrastructure/external/memoryCache.service', () => {
    return jest.fn().mockImplementation(() => ({
        getAttempts: jest.fn().mockReturnValue(0),
        incrementAttempts: jest.fn(),
        clearAttempts: jest.fn()
    }));
});

// 3. IMPORTAR APP
const app = require('../Back/src/app');

describe('Pruebas de Integración - App.js', () => {
    
    // IMPORTANTE: Limpiamos los temporizadores de Node
    afterAll(async () => {
        jest.useRealTimers();
    });

    test('Manejo de rutas no encontradas (404)', async () => {
        const response = await request(app).get('/api/ruta-inexistente');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Ruta no encontrada' });
    });

    test('GET /test - Renderizado Mockeado', async () => {
        // Mockeamos el render para no lidiar con archivos EJS
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