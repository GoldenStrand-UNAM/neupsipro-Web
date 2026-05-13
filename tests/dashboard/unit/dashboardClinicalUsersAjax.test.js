const GetUserInfoUseCase = require('../../../Back/src/application/usecase/dashboard/getUserInfoUseCase');

jest.mock('../../../Back/src/application/dto/clinicalDashboardDTO', () => ({
  userInfoDTO: jest.fn().mockImplementation((userInfo) => ({
    id: userInfo?.idUser ?? undefined,
    name: userInfo?.name ?? undefined,
    email: userInfo?.email ?? undefined,
    pp: userInfo?.pp ?? null,
  })),
}));

describe('GetUserInfoUseCase', () => {
  let dashboardRepository, useCase;

  beforeEach(() => {
    dashboardRepository = {
      fetchInfoUser: jest.fn(),
    };
    useCase = new GetUserInfoUseCase(dashboardRepository);
  });

  test('throw an error if fetchInfoUser fails', async () => {
    dashboardRepository.fetchInfoUser.mockRejectedValue(new Error('Error ejecutando la consulta'));
    await expect(useCase.execute({ idUser: 1 })).rejects.toThrow('Error ejecutando la consulta');
  });

  test('throw error with specific message if repository throws', async () => {
    dashboardRepository.fetchInfoUser.mockRejectedValue(new Error('Error obteniendo información del usuario'));
    await expect(useCase.execute({ idUser: 99 })).rejects.toThrow('Error obteniendo información del usuario');
  });

    test('return empty/undefined structure if repository returns empty data', async () => {
    dashboardRepository.fetchInfoUser.mockResolvedValue([]);

    const result = await useCase.execute({ idUser: 1 });

    expect(result).toEqual({
        id: undefined,
        name: undefined,
        email: undefined,
        pp: null,
    });
    });

    test('Happy path', async () => {
    const userInfo = {
        idUser: 7,
        name: 'Laura Mendoza',
        email: 'laura.mendoza@neupsi.com',
        pp: null,
    };

    dashboardRepository.fetchInfoUser.mockResolvedValue([userInfo]);

    const result = await useCase.execute({ idUser: 7 });

    expect(result).toEqual({
        id: 7,
        name: 'Laura Mendoza',
        email: 'laura.mendoza@neupsi.com',
        pp: null,
    });

    expect(dashboardRepository.fetchInfoUser)
        .toHaveBeenCalledWith({ idUser: 7 });
    });
});