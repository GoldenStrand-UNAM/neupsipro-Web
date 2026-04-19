/* global describe, test, expect, jest, beforeEach */
const AuthMiddleware = require('../Back/src/Infrastructure/Auth/auth.middleware');

describe('Unit Test - AuthMiddleware', () => {
    let authMiddleware;
    let mockJwtService;
    let req, res, next;

    beforeEach(() => {
        // Mock del servicio JWT
        mockJwtService = {
            verifyToken: jest.fn()
        };

        authMiddleware = new AuthMiddleware(mockJwtService);

        // Mock de Request con cookies
        req = {
            cookies: {}
        };

        // Mock de Response con métodos encadenables
        res = {
            redirect: jest.fn(),
            clearCookie: jest.fn().mockReturnThis()
        };

        next = jest.fn();
    });

    test('Debería redireccionar a /auth/ si no hay token (Líneas 7-9)', () => {
        req.cookies.jwt_token = null;

        authMiddleware.verifyToken(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/auth/');
        expect(next).not.toHaveBeenCalled();
    });

    test('Debería llamar a next() y asignar user si el token es válido', () => {
        const mockUser = { id: 1, name: 'Ricardo' };
        req.cookies.jwt_token = 'token_valido';
        mockJwtService.verifyToken.mockReturnValue(mockUser);

        authMiddleware.verifyToken(req, res, next);

        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
    });

    test('Debería limpiar cookie y redireccionar si el token es inválido (Bloque catch)', () => {
        req.cookies.jwt_token = 'token_corrupto';
        const errorMsg = 'Token expirado';
        mockJwtService.verifyToken.mockImplementation(() => {
            throw errorMsg;
        });

        authMiddleware.verifyToken(req, res, next);

        expect(res.clearCookie).toHaveBeenCalledWith('jwt_token');
        expect(res.redirect).toHaveBeenCalledWith(
            expect.stringContaining(`/auth/login?error=${encodeURIComponent(errorMsg)}`)
        );
        expect(next).not.toHaveBeenCalled();
    });
});