const request = require('supertest');
const app = require('../Back/src/app');

describe('GET /usuarios', () => {

    test('retorna status 200', async () => {
        const response = await request(app).get('/usuarios');
        expect(response.status).toBe(200);
    });


});

