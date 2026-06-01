const DeleteClinicalUseCase = require('../../../Back/src/application/usecase/clinical/deleteClinicalUseCase');
describe('DeleteClinicalUseCase Unit Tests', () => {
    let mockClinicalRepository;
    let useCase;

    beforeEach(() => {
        mockClinicalRepository = {
            fetchClinical: jest.fn(),
            softDeleteUser: jest.fn()
        };
        useCase = new DeleteClinicalUseCase(mockClinicalRepository);
    });

    test('must throw error if no id_user', async () => {
        await expect(useCase.execute({})).rejects.toThrow('id_user is required');
    });

    test('must throw error if clinical doesnt exist', async () => {
        mockClinicalRepository.fetchClinical.mockResolvedValue([]);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('Clinical not found');
        expect(mockClinicalRepository.fetchClinical).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('must do the delete logic correctly', async () => {
        mockClinicalRepository.fetchClinical.mockResolvedValue([{ id_user: 1 }]);
        mockClinicalRepository.softDeleteUser.mockResolvedValue(true);
        const result = await useCase.execute({ id_user: 1 });
        expect(result).toEqual({
            success: true,
            message: 'Clinical user deleted successfully'
        });
        expect(mockClinicalRepository.softDeleteUser).toHaveBeenCalledWith({ id_user: 1 });
    });

    test('must throw error if the repository fails to delete', async () => {
        mockClinicalRepository.fetchClinical.mockResolvedValue([{ id_user: 1 }]);
        mockClinicalRepository.softDeleteUser.mockResolvedValue(false);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('Failed to delete clinical');
    });

    test('must not call softDeleteUser when clinical does not exist', async () => {
        mockClinicalRepository.fetchClinical.mockResolvedValue([]);

        await expect(
            useCase.execute({ id_user: 1 })
        ).rejects.toThrow('Clinical not found');

        expect(mockClinicalRepository.softDeleteUser)
            .not.toHaveBeenCalled();
    });

    test('must propagate repository errors', async () => {
        mockClinicalRepository.fetchClinical.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            useCase.execute({ id_user: 1 })
        ).rejects.toThrow('Database error');
    });

    test('must propagate delete repository errors', async () => {
        mockClinicalRepository.fetchClinical.mockResolvedValue([{ id_user: 1 }]);

        mockClinicalRepository.softDeleteUser.mockRejectedValue(
            new Error('Database error')
        );

        await expect(
            useCase.execute({ id_user: 1 })
        ).rejects.toThrow('Database error');
    });
});
