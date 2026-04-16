/* global describe, test, expect, beforeEach */
const JwtService = require('../Back/src/infrastructure/external/jwt.service');
const jwt = require('jsonwebtoken');

describe('Unit Test - JwtService', () => {
    let jwtService;
    const mockSecret = 'test_secret_123';
    const mockPayload = { userId: 1, role: 'admin' };

    beforeEach(() => {
        // Configuramos el ambiente para el test
        process.env.JWT_SECRET = mockSecret;
        process.env.JWT_EXPIRES_IN = '1h';
        jwtService = new JwtService();
    });

    test('Debería generar un token válido', () => {
        const token = jwtService.generateToken(mockPayload);
        
        expect(token).toBeDefined();
        // Verificamos que sea un string con el formato de JWT (tres partes separadas por puntos)
        expect(token.split('.').length).toBe(3);
    });

    test('Debería verificar un token correctamente y devolver el payload', () => {
        const token = jwtService.generateToken(mockPayload);
        const decoded = jwtService.verifyToken(token);
        
        expect(decoded.userId).toBe(mockPayload.userId);
        expect(decoded.role).toBe(mockPayload.role);
    });

    test('Debería lanzar error si no existe JWT_SECRET', () => {
        delete process.env.JWT_SECRET;
        
        // Al intentar generar un token sin secreto, debe lanzar el error que definiste
        expect(() => {
            jwtService.generateToken(mockPayload);
        }).toThrow("No se encontró JWT_SECRET");
    });

    test('Debería lanzar error si el token es inválido o ha expirado', () => {
        const tokenInvalido = 'este.no.es.un.token';
        
        expect(() => {
            jwtService.verifyToken(tokenInvalido);
        }).toThrow(); // JsonWebTokenError
    });
});