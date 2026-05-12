const GetClinicalUsers = require('../../../Back/src/application/usecase/users/getUserUseCase')

describe('GetClinicalUsers Use Case', () => {
  it('debe manejar el error cuando el repositorio falla', async() => {
    const mockRepo = {
      fetchOne: jest.fn().mockRejectedValue(new Error('DB_Error'))
    };

    const useCase = new GetClinicalUsers(mockRepo);

    await expect(useCase.execute({ id_user: 1 })).rejects.toThrow('DB_Error');
  });
});
