const GetClinicalUserDashboardUseCase = require('../../../Back/src/application/usecase/dahsboard/getClinicalUserDashboardUseCase');

jest.mock('../../../Back/src/application/dto/clinicalDashboardDTO', () => ({
  clinicalDashboardDTO: jest.fn().mockImplementation((numberUsers, users, appointments) => ({
    numberUsers,
    users: { usersList: users },
    appointments,
  })),
}));

describe('GetClinicalUserDashboardUseCase', () => {
  let usersRepository, appointmentRepository, useCase;

  beforeEach(() => {
    usersRepository = {
      fetchNumberUsers: jest.fn(),
      fetchAllWithClinical: jest.fn(),
    };
    appointmentRepository = {
      fecthAppointmentWithClinical: jest.fn(),
    };
    useCase = new GetClinicalUserDashboardUseCase(usersRepository, appointmentRepository);
  });

  test('throw an error if all fetches fail', async () => {
    usersRepository.fetchNumberUsers.mockRejectedValue(new Error('Error ejecutando la consulta'));
    usersRepository.fetchAllWithClinical.mockRejectedValue(new Error('Error ejecutando la consulta'));
    appointmentRepository.fecthAppointmentWithClinical.mockRejectedValue(new Error('Error ejecutando la consulta'));
    await expect(useCase.execute({ idClinicalUser: 1 })).rejects.toThrow('Error ejecutando la consulta');
  });

  test('throw error if fetchNumberUsers fails', async () => {
    usersRepository.fetchNumberUsers.mockRejectedValue(new Error('Error obteniendo número de usuarios'));
    usersRepository.fetchAllWithClinical.mockResolvedValue([]);
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue([]);
    await expect(useCase.execute({ idClinicalUser: 1 })).rejects.toThrow('Error obteniendo número de usuarios');
  });

  test('throw error if fetchAllWithClinical fails', async () => {
    usersRepository.fetchNumberUsers.mockResolvedValue([{ total: 0 }]);
    usersRepository.fetchAllWithClinical.mockRejectedValue(new Error('Error obteniendo usuarios clínicos'));
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue([]);
    await expect(useCase.execute({ idClinicalUser: 1 })).rejects.toThrow('Error obteniendo usuarios clínicos');
  });

  test('throw error if fecthAppointmentWithClinical fails', async () => {
    usersRepository.fetchNumberUsers.mockResolvedValue([{ total: 0 }]);
    usersRepository.fetchAllWithClinical.mockResolvedValue([]);
    appointmentRepository.fecthAppointmentWithClinical.mockRejectedValue(new Error('Error obteniendo citas'));
    await expect(useCase.execute({ idClinicalUser: 1 })).rejects.toThrow('Error obteniendo citas');
  });

  test('return empty structures if there is no data', async () => {
    usersRepository.fetchNumberUsers.mockResolvedValue([{ total: 0 }]);
    usersRepository.fetchAllWithClinical.mockResolvedValue([]);
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue([]);

    const result = await useCase.execute({ idClinicalUser: 1 });

    expect(result).toEqual({
      numberUsers: { total: 0 },
      users: { usersList: [] },
      appointments: [],
    });
  });

  test('Happy path', async () => {
    const fakeNumberUsers = [{ total: 3 }];
    const fakeUsers = [
      { idUser: 1, name: 'Ana López', protocol: 'P-001' },
      { idUser: 2, name: 'Carlos Ruiz', protocol: 'P-002' },
      { idUser: 3, name: 'María Torres', protocol: 'P-003' },
    ];
    const fakeAppointments = [
      { idAppointment: 10, idUser: 1, date: '2025-06-01', status: 'scheduled' },
      { idAppointment: 11, idUser: 2, date: '2025-06-03', status: 'completed' },
    ];

    usersRepository.fetchNumberUsers.mockResolvedValue(fakeNumberUsers);
    usersRepository.fetchAllWithClinical.mockResolvedValue(fakeUsers);
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue(fakeAppointments);

    const result = await useCase.execute({ idClinicalUser: 5 });

    expect(result).toEqual({
      numberUsers: { total: 3 },
      users: { usersList: fakeUsers },
      appointments: fakeAppointments,
    });

    expect(usersRepository.fetchNumberUsers).toHaveBeenCalledWith({ idClinicalUser: 5 });
    expect(usersRepository.fetchAllWithClinical).toHaveBeenCalledWith({ idClinicalUser: 5 });
    expect(appointmentRepository.fecthAppointmentWithClinical).toHaveBeenCalledWith({ idClinicalUser: 5 });
  });
});