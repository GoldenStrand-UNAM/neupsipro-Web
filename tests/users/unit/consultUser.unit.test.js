const consultUserUseCase = require('../../../Back/src/application/usecase/users/getUserUseCase');

describe('consultUserUseCase', () => {
  let userRepository, testAppRepo, useCase;

  // Reset mocks and rebuild the use case
  beforeEach(() => {
    userRepository = { fetchOne: jest.fn() };
    testAppRepo = { fetchTestApplications: jest.fn() };
    useCase = new consultUserUseCase(userRepository, testAppRepo);
  });

  test('throw an error if user is not found', async () => {
    userRepository.fetchOne.mockResolvedValue([]);
    await expect(useCase.execute({ id_user: 'u-999' }))
      .rejects.toThrow('Usuario no encontrado');
  });

  test('does not consult applications if protocol is Pending', async () => {
    userRepository.fetchOne.mockResolvedValue([
      { protocol: 'Pending', photo: null }
    ]);
    const result = await useCase.execute({ id_user: 'u-006' });
    expect(testAppRepo.fetchTestApplications).not.toHaveBeenCalled();
    expect(result.hasProtocol).toBe(false);
  });

  test('consults applications if there is a valid protocol', async () => {
    userRepository.fetchOne.mockResolvedValue([
      { protocol: 'Clinical', photo: null }
    ]);
    testAppRepo.fetchTestApplications.mockResolvedValue([]);
    const result = await useCase.execute({ id_user: 'u-001' });
    expect(testAppRepo.fetchTestApplications).toHaveBeenCalledWith({ id_user: 'u-001' });
    expect(result.hasProtocol).toBe(true);
  });

  test('returns the assigned applications when there is a protocol', async () => {
    const apps = [
      { idApplication: 1, status: 'En proceso' },
      { idApplication: 2, status: 'Entregado' }
    ];
    userRepository.fetchOne.mockResolvedValue([
      { protocol: 'Clinical', photo: null }
    ]);
    testAppRepo.fetchTestApplications.mockResolvedValue(apps);
    const result = await useCase.execute({ id_user: 'u-001' });
    expect(result.assignedApplications).toEqual(apps);
  });
});