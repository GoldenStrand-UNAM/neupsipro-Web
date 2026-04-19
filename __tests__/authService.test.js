/* global describe, test, expect, beforeEach */
const AuthService = require('../Back/src/infrastructure/Auth/AuthService');

describe('Unit Test - AuthService (Blacklist logic)', () => {
    let authService;

    beforeEach(() => {
        authService = new AuthService();
    });

    test('Debería añadir un token a la blacklist', () => {
        const token = 'token-123';
        authService.invalidateSession(token);
        
        expect(authService.isBlacklisted(token)).toBe(true);
    });

    test('Debería retornar false si un token no está en la blacklist', () => {
        expect(authService.isBlacklisted('token-inexistente')).toBe(false);
    });
});