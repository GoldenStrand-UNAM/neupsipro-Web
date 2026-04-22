const request = require('supertest');
const mockFindByUsername = jest.fn();
const mockCompare = jest.fn();
const mockGenerateToken = jest.fn();
const mockCreateSession = jest.fn();
/*
    This test is designed to run integration tests for login, the main features it tests are:
    - Basic flow that tests from login to home
    - Alternate flows for login
    - Sql Inyection
    - XSS
    - DDoS 
 */
jest.mock('../../../Back/src/infrastructure/repositories/authRepository', () => {            
    return jest.fn().mockImplementation(() => ({
            findByUsername: mockFindByUsername,
            getPrivileges: jest.fn().mockResolvedValue([]),
            getExceptions: jest.fn().mockResolvedValue([])
    }));
});

jest.mock('../../../Back/src/infrastructure/external/hashing.service', () => {
    return jest.fn().mockImplementation(() => ({ compare: mockCompare }));
});

jest.mock('../../../Back/src/infrastructure/external/jwt.service', () => {
    return jest.fn().mockImplementation(() => ({ generateToken: mockGenerateToken }));
});

jest.mock('../../../Back/src/infrastructure/repositories/sessionRepository', () => {
    return jest.fn().mockImplementation(() => ({ createSession: mockCreateSession }));
});

const app = require('../../../Back/src/app');

describe('Login Integration Test', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('POST /auth/login - Éxito: Debe redirigir a /home y crear cookie', async () => {
        mockFindByUsername.mockResolvedValue({
            id_user: 1,
            user_name: 'testuser',
            password_hash: 'hash_cualquiera',
            id_role: 1,
            eliminated: 0
        });
        mockCompare.mockResolvedValue(true);
        mockGenerateToken.mockReturnValue('fake-token');
        mockCreateSession.mockResolvedValue(123);

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        expect(response.status).toBe(302);
    });

    test('POST /auth/login - Error: Campos vacíos', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: '', password: '' });
        
        expect(response.text).toContain('El usuario y la contraseña son obligatorios');
    });

    test('POST /auth/login - Error: Credenciales inválidas', async () => {
        mockFindByUsername.mockResolvedValue({ id_user: 1, user_name: 'test', password_hash: 'h', eliminated: 0});
        mockCompare.mockResolvedValue(false);

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'testuser', password: 'wrongpassword' });
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('Credenciales inválidas');
    });

    test('POST /auth/login - Error: Usuario no encontrado', async () => {
        mockFindByUsername.mockResolvedValue(null);

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'usuario_fantasma', password: '123' });
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('Credenciales inválidas');
    });

    test('POST /auth/login - SQL Injection: No debe permitir bypass', async () => {
        mockFindByUsername.mockResolvedValue(null);

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: "' OR '1'='1",
                password: "password"
            });
        
        expect(response.status).toBe(200);
        expect(response.text).toContain('Credenciales inválidas');
    });

    test('POST /auth/login - XSS: Debe escapar caracteres especiales en la respuesta', async () => {
        const xssPayload = "<script>alert('xss')</script>";

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: xssPayload,
                password: "password"
            });
        
        expect(response.text).not.toContain(xssPayload);
    });

    test('POST /auth/login - Rate Limiting: Debe bloquear tras muchos intentos', async () => {
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post('/auth/login')
                .send({ username: 'test', password: '1'});
        }

        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'test', password: '1' });

        expect(response.status).toBe(429);
    });
});