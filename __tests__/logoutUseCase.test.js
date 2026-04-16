/* global describe, test, expect, jest, beforeEach */
const LogoutUseCase = require('../Back/src/application/usecase/auth/logoutUseCase');

describe('Unit Test - LogoutUseCase', () => {
    let logoutUseCase;
    let mockAuthRepository;

    beforeEach(() => {
        // Mockeamos el servicio de autenticación
        mockAuthRepository = {
            invalidateSession: jest.fn()
        };
        logoutUseCase = new LogoutUseCase(mockAuthRepository);
    });

    test('Debería cerrar sesión exitosamente si se provee un token', async () => {
        const mockToken = 'token_valido_123';
        mockAuthRepository.invalidateSession.mockResolvedValue(true);

        const result = await logoutUseCase.execute(mockToken);

        expect(result).toBe(true);
        expect(mockAuthRepository.invalidateSession).toHaveBeenCalledWith(mockToken);
    });

    test('Debería lanzar un error si no se proporciona un token', async () => {
        // Probamos enviando null o undefined
        await expect(logoutUseCase.execute(null))
            .rejects.toThrow('Token requerido');
        
        // Verificamos que el servicio de logout ni siquiera se llamó
        expect(mockAuthRepository.invalidateSession).not.toHaveBeenCalled();
    });

    test('Debería propagar el error si el servicio de auth falla', async () => {
        mockAuthRepository.invalidateSession.mockRejectedValue(new Error('DB Error'));

        await expect(logoutUseCase.execute('token_cualquiera'))
            .rejects.toThrow('DB Error');
    });
});