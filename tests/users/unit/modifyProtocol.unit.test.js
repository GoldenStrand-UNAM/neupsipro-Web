const ModifiyProtocolUseCase = require('../../../Back/src/application/usecase/users/modifyProtocolUseCase');

describe('ModifyProtocolUseCase Unit Tests', () => {
    let mockUserRepository;
    let useCase;

    beforeEach(() => {
        mockUserRepository = {
            fetchOne: jest.fn(),
            editUserProtocol: jest.fn()
        };
        useCase = new ModifiyProtocolUseCase(mockUserRepository);
    });

    test('must throw error if no id_user', async () => {
        await expect(useCase.execute({})).rejects.toThrow('id_user is required');
    });

    test('must throw error if user doesnt exist', async () => {
        mockUserRepository.fetchOne.mockResolvedValue([]);
        await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('User not found');
        expect(mockUserRepository.fetchOne).toHaveBeenCalledWith({ id_user: 1 });
    });

    //Happy path
    test('must successfully update the user protocol', async () => {
    const payload = { id_user: 1, protocol: "Clinical" };
    mockUserRepository.fetchOne.mockResolvedValue([{ id_user: 1 }]);
    mockUserRepository.editUserProtocol.mockResolvedValue(true);

    const result = await useCase.execute(payload);

    expect(mockUserRepository.fetchOne).toHaveBeenCalledWith({ id_user: 1 });
    expect(mockUserRepository.editUserProtocol).toHaveBeenCalledWith(payload);
    expect(result).toBeDefined();
});
});