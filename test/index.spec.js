const app = require('../Back/src/app.js');

const request = require('supertest')

describe ('Routes GET /users/:id', () => {
    test ('Must return status 200', async () => {
        const response = await request(app).get('/forum').send();
        expect(response.statusCode).toBe(200);
    })
});

