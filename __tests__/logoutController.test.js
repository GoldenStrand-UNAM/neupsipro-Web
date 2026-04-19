/* global describe, test, expect, jest, beforeEach */
const LogoutController = require('../Back/src/Presentation/controller/auth/logout.controller');

describe('Unit Test - LogoutController', () => {
    let logoutController;
    let mockLogoutUseCase;
    let req, res;

    beforeEach(() => {
        mockLogoutUseCase = { execute: jest.fn() };
        logoutController = new LogoutController(mockLogoutUseCase);
        req = { headers: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('Debería cerrar sesión correctamente con un token válido', () => {
        req.headers.authorization = 'Bearer mi_token_pro';
        
        logoutController.logout(req, res);

        expect(mockLogoutUseCase.execute).toHaveBeenCalledWith('mi_token_pro');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Sesión cerrada correctamente" });
    });

    test('Debería manejar errores si el UseCase falla (Catch)', () => {
        mockLogoutUseCase.execute.mockImplementation(() => {
            throw new Error('Fallo en logout');
        });

        logoutController.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Fallo en logout' });
    });
});