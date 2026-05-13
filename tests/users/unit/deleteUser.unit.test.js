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

    test('must throw error if no id_user', async () => {
        await expect(useCase.execute({})).rejects.toThrow('id_user is required');
    });

    test('must throw error if user doesnt exist', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([]);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('User not found');
        expect(mockUserRepository.fetchOne).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('must do the delete logic correctly', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([{ id_user: 1 }]);
        mockUserRepository.softDeleteUser.mockResolvedValue(true);
        const result = await useCase.execute({ id_user: 1 });
        expect(result).toEqual({
            success: true,
            message: 'User deleted successfully'
        });
        expect(mockUserRepository.softDeleteUser).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('must throw error if the repository fails to delete', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([{ id_user: 1 }]);
        mockUserRepository.softDeleteUser.mockResolvedValue(false);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('Failed to delete user');
    });
});
