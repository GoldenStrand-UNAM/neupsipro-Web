const LoginUseCase = require('../../../Back/src/application/usecase/auth/loginUseCase');

describe('LoginUseCase Unit Test', () => {
    let loginUseCase;
    let mockAuthRepo, mockHashService, mockJwtService, mockCache, mockSessionRepo;

    beforeEach(() => {
        mockAuthRepo = { findByUsername: jest.fn() };
        mockHashService = { compare: jest.fn() };
        mockJwtService = { generateToken: jest.fn() };
        mockCache = { getAttempts: jest.fn(), incrementAttempts: jest.fn(), clearAttempts: jest.fn() };
        mockSessionRepo = { createSession: jest.fn(), deleteAllActiveSessions: jest.fn() };

        loginUseCase = new LoginUseCase(
            mockAuthRepo, mockHashService, mockJwtService, mockCache, mockSessionRepo
        );
    });

    test('should throw error if attempts reach limit (Security Logic)', async () => {
        mockCache.getAttempts.mockReturnValue(4);

        await expect(loginUseCase.execute('user', 'pass'))
            .rejects.toThrow('Límite de intentos');
    });

    test('should return token on succesful login', async () => {
        mockCache.getAttempts.mockReturnValue(0);
        mockAuthRepo.findByUsername.mockResolvedValue({
            id_user: 1, user_name: 'test', password_hash: 'hashed', eliminated: 0
        });
        mockHashService.compare.mockResolvedValue(true);
        mockJwtService.generateToken.mockReturnValue('fake-jwt-token');
        mockSessionRepo.createSession.mockResolvedValue(123);

        const token = await loginUseCase.execute('test', 'pass', '127.0.0.1', 'agent');

        expect(token).toBe('fake-jwt-token');
        expect(mockCache.clearAttempts).toHaveBeenCalled();
    });
});