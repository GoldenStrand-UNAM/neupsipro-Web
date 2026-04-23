const AuthorizationUseCase = require('../../../Back/src/application/usecase/auth/authorizationUseCase');

describe('AuthorizationUseCase - ACL Logic', () => {
    // Simulates repository with controlled data
    const mockRepo = {
        getPrivileges: jest.fn(),
        getExceptions: jest.fn()
    };
    
    const authUC = new AuthorizationUseCase(mockRepo);

    test('should allow action if user has an explicit exception (1)', async () => {
        // Configure mock to return writing exception
        mockRepo.getPrivileges.mockResolvedValue([]);
        mockRepo.getExceptions.mockResolvedValue([{
            module_name: 'forum',
            consultation: 1,
            writing: 1,
            edit: 0,
            eliminate: 0
        }]);

        const result = await authUC.checkPermission(1, 'forum', 'writing');
        expect(result).toBe(true);
    });

    test('should deny action if user is eliminated (Entity check)', () => {
        const User = require('../../../Back/src/domain/entity/auth');
        const eliminatedUser = new User({ idUser: 1, 
            eliminated: true });

        expect(() => eliminatedUser.checkIfActive()).toThrow('Esta cuenta ha sido desactivada');
    })
})