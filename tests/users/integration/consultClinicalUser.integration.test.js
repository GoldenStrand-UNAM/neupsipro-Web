const request = require('supertest');
const app = require('../../../Back/src/app');

describe('Clinical User Controller - Integration', () => {
    it('debe redirigir a /login si se accede por enlace directo sin sesión', async () => {
        const response = await request(app)
            .get('/consultUser/1')
            .send();
        
        expect(response.status).toBe(302);
        expect(response.header.location).toBe('/login');
    });

    it('debe responder con 200 y renderizar la vista de tabla', async () => {
        const response = await request(app)
            .get('/consultUser')
            .set('Cookie', ['session_id=valid_mock_id']);

        expect(response.status).toBe(200);
        expect(response.text).toContain('Consultar Información');
    });
});