const DeleteUserUseCase = require('../../../Back/src/application/usecase/users/deleteUserUseCase');

describe('DeleteUserUseCase Unit Tests', () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            fetchOne: jest.fn(),
            softDeleteUser: jest.fn()
        };
        useCase = new DeleteUserUseCase(mockUserRepository);
    });

    test('Debe lanzar error si no se proporciona id_user', async () => {
        await expect(useCase.execute({})).rejects.toThrow('id_user is required');
    });

    test('Debe lanzar error si el usuario no existe', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([]);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('User not found');
        expect(mockUserRepository.fetchOne).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('Debe realizar el borrado lógico exitosamente', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([{ id_user: 1 }]);
        mockUserRepository.softDeleteUser.mockResolvedValue(true);
        const result = await useCase.execute({ id_user: 1 });
        expect(result).toEqual({
            success: true,
            message: 'User deleted successfully'
        });
        expect(mockUserRepository.softDeleteUser).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('Debe lanzar error si el repositorio falla al borrar', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([{ id_user: 1 }]);
        mockUserRepository.softDeleteUser.mockResolvedValue(false);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('Failed to delete user');
    });
});
