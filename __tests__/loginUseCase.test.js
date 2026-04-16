/* global describe, test, expect, jest, beforeEach */
const LoginUseCase = require('../Back/src/application/usecase/auth/loginUseCase');

describe('Unit Test - LoginUseCase', () => {
    let loginUseCase;
    let mockAuthRepository;
    let mockHashingService;
    let mockJwtService;
    let mockCacheService;

    beforeEach(() => {
        // Creamos versiones falsas de los servicios
        mockAuthRepository = { findByUsername: jest.fn() };
        mockHashingService = { compare: jest.fn() };
        mockJwtService = { generateToken: jest.fn() };
        mockCacheService = { 
            getAttempts: jest.fn().mockReturnValue(0),
            incrementAttempts: jest.fn(),
            clearAttempts: jest.fn() 
        };

        loginUseCase = new LoginUseCase(
            mockAuthRepository,
            mockHashingService,
            mockJwtService,
            mockCacheService
        );
    });

    test('Debería lanzar error si el usuario no existe', async () => {
        // Configuramos el mock para que devuelva null (usuario no encontrado)
        mockAuthRepository.findByUsername.mockResolvedValue(null);

        await expect(loginUseCase.execute('usuario_fantasma', '1234'))
            .rejects.toThrow('Credenciales inválidas');
        
        // Verificamos que se incrementaron los intentos en el cache
        expect(mockCacheService.incrementAttempts).toHaveBeenCalledWith('usuario_fantasma');
    });

    test('Debería lanzar error si la contraseña es incorrecta', async () => {
        // Simulamos que el usuario SÍ existe
        mockAuthRepository.findByUsername.mockResolvedValue({ 
            user_name: 'ricardo', 
            password_hash: 'hash_real' 
        });
        // Pero el hashing dice que NO coincide
        mockHashingService.compare.mockResolvedValue(false);

        await expect(loginUseCase.execute('ricardo', 'password_mal'))
            .rejects.toThrow('Credenciales inválidas');
        
        expect(mockCacheService.incrementAttempts).toHaveBeenCalled();
    });

    test('Debería lanzar error si la cuenta está eliminada', async () => {
        mockAuthRepository.findByUsername.mockResolvedValue({ 
            user_name: 'ricardo', 
            eliminated: 1 // Usuario marcado como eliminado
        });

        await expect(loginUseCase.execute('ricardo', '1234'))
            .rejects.toThrow('Esta cuenta ha sido desactivada');
    });

    test('Debería generar un token si todo es correcto', async () => {
        const userEntity = { 
            id_user: 1, 
            user_name: 'ricardo', 
            password_hash: 'hash_ok', 
            eliminated: 0 
        };
        
        mockAuthRepository.findByUsername.mockResolvedValue(userEntity);
        mockHashingService.compare.mockResolvedValue(true);
        mockJwtService.generateToken.mockReturnValue('token_fake_123');

        const result = await loginUseCase.execute('ricardo', '1234');

        expect(result).toBe('token_fake_123');
        expect(mockCacheService.clearAttempts).toHaveBeenCalledWith('ricardo');
    });

    test('Debería lanzar error si se alcanza el límite de intentos (Línea 14)', async () => {
        // Simulamos que el cache dice que ya lleva 4 intentos
        mockCacheService.getAttempts.mockReturnValue(4);
    
        await expect(loginUseCase.execute('usuario_bloqueado', 'CualquierPassword'))
            .rejects.toThrow('Límite de intentos de inicio de sesión alcanzados');
        
        // Verificamos que ni siquiera intentó buscar al usuario en la DB
        expect(mockAuthRepository.findByUsername).not.toHaveBeenCalled();
    });
});