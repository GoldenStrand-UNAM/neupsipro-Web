const deleteApplicationUseCase = require('../../../Back/src/application/usecase/testApplications/deleteApplicationUseCase');

describe('deleteApplicationUseCase Unit Tests', () => {
  let mockAppRepo;
  let mockResultsRepo;
  let useCase;

  beforeEach(() => {
    mockAppRepo = {
      fetchApplicationById: jest.fn(),
      deleteApplication:    jest.fn(),
    };
    mockResultsRepo = {
      deleteAllResults: jest.fn(),
    };
    useCase = new deleteApplicationUseCase(mockAppRepo, mockResultsRepo);
  });

  test('must throw 404 if application does not exist', async () => {
    mockAppRepo.fetchApplicationById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id_user: 'user-1', id_application: 'app-999' })
    ).rejects.toMatchObject({ status: 404, message: 'Application not found' });

    expect(mockAppRepo.fetchApplicationById).toHaveBeenCalledWith({ id_application: 'app-999' });
  });

  test('must throw 403 if the application does not belong to the user', async () => {
    mockAppRepo.fetchApplicationById.mockResolvedValue({
      idApplication:   'app-1',
      idUser:          'user-2',   // different user
      applicationName: 'Test App',
      status:          1,
    });

    await expect(
      useCase.execute({ id_user: 'user-1', id_application: 'app-1' })
    ).rejects.toMatchObject({ status: 403, message: 'Forbidden' });

    expect(mockResultsRepo.deleteAllResults).not.toHaveBeenCalled();
    expect(mockAppRepo.deleteApplication).not.toHaveBeenCalled();
  });

  test('must delete results and application when valid', async () => {
    mockAppRepo.fetchApplicationById.mockResolvedValue({
      idApplication:   'app-1',
      idUser:          'user-1',
      applicationName: 'Test App',
      status:          1,
    });
    mockResultsRepo.deleteAllResults.mockResolvedValue(true);
    mockAppRepo.deleteApplication.mockResolvedValue(true);

    const result = await useCase.execute({ id_user: 'user-1', id_application: 'app-1' });

    expect(result).toEqual({ deleted: true });
    expect(mockResultsRepo.deleteAllResults).toHaveBeenCalledWith({ id_application: 'app-1' });
    expect(mockAppRepo.deleteApplication).toHaveBeenCalledWith({ id_application: 'app-1' });
  });


  test('must propagate error if deleteAllResults throws', async () => {
    mockAppRepo.fetchApplicationById.mockResolvedValue({
      idApplication: 'app-1',
      idUser:        'user-1',
      status:        1,
    });
    mockResultsRepo.deleteAllResults.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute({ id_user: 'user-1', id_application: 'app-1' })
    ).rejects.toThrow('DB error');

    expect(mockAppRepo.deleteApplication).not.toHaveBeenCalled();
  });

  test('must propagate error if deleteApplication throws', async () => {
    mockAppRepo.fetchApplicationById.mockResolvedValue({
      idApplication: 'app-1',
      idUser:        'user-1',
      status:        1,
    });
    mockResultsRepo.deleteAllResults.mockResolvedValue(true);
    mockAppRepo.deleteApplication.mockRejectedValue(new Error('DB error'));

    await expect(
      useCase.execute({ id_user: 'user-1', id_application: 'app-1' })
    ).rejects.toThrow('DB error');
  });
});