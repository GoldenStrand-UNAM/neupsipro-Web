const request = require('supertest');

jest.mock("../Back/src/infrastructure/database/database", () => ({
    query: jest.fn(),
    getConnection: jest.fn((cb) => cb(null, { release: () => {} }))
}));

const app = require('../Back/src/app');
const AuthRepository = require("../Back/src/infrastructure/repositories/authRepository");
const { getConnection } = require('../Back/src/infrastructure/database/database');

jest.mock("../Back/src/infrastructure/repositories/authRepository");

describe('Pruebas de Login - Casos de Uso', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('FB01: Debería iniciar sesión y asignar un token (Redirección a principal)', async () => {
        AuthRepository.prototype.findByUsername = jest.fn().mockResolvedValue({
            id: 1,
            username: 'ricardo',
            password: '$2b$10$hashSimulado...'
        });

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'ricardo', password: 'password123' });
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('NeuPsi-Pro');
    });

    test('F1: Debería fallar si los campos están vacíos', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({username: '', password: ''});
        
        expect(response.text).toContain('El usuario y la contraseña son obligatorios');
    });

    test('F3: Debería fallar con credenciales incorrectas (Usuario no existe)', async () => {
        AuthRepository.prototype.findByUsername = jest.fn().mockResolvedValue(null);

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'fantasma', password: 'wrongpassword' });
        
        expect(response.status).toBe(401);
    });

    test('F4: Debería mostrar error inesperado si falla la asignación de token', async () => {
        AuthRepository.prototype.findByUsername = jest.fn().mockResolvedValue({
            id: 1, username: 'ricardo', password: 'hash'
        });

        jest.spyOn(console, 'error').mockImplementation(() => {});

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'ricardo', password: 'password123' });
        
        expect(response.text).toContain('Error inesperado');
    });
});
