const GetClinicalUserDashboardUseCase = require('../../../Back/src/application/usecase/dashboard/getClinicalUserDashboardUseCase');

jest.mock('../../../Back/src/application/dto/clinicalDashboardDTO', () => ({
  clinicalDashboardDTO: jest.fn().mockImplementation(
    (numbers, users, today, tomorrow, other, historicalNumbers) => ({
      numbers,
      users: { usersList: users },
      appointmentsToday:     { appointmentsList: today },
      appointmentsTomorrow:  { appointmentsList: tomorrow },
      appointmentsOther:     { appointmentsList: other },
      historicalNumbers,
    })
  ),
}));

describe('GetClinicalUserDashboardUseCase', () => {
  let usersRepository, appointmentRepository, useCase;

  beforeEach(() => {
    usersRepository = {
      fetchNumberUsers: jest.fn(),
      fetchAllWithClinical: jest.fn(),
      fetchHistoricalNumberUsers: jest.fn(),

    };
    appointmentRepository = {
      fecthAppointmentWithClinical: jest.fn(),
    };
    useCase = new GetClinicalUserDashboardUseCase(usersRepository, appointmentRepository);
  });

  test('throw an error if all fetches fail', async () => {
    usersRepository.fetchNumberUsers.mockRejectedValue(new Error('Error ejecutando la consulta'));
    usersRepository.fetchAllWithClinical.mockResolvedValue([]);  
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue([]);
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
    usersRepository.fetchHistoricalNumberUsers.mockResolvedValue([{ total: 0 }]);
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue([]);

    const result = await useCase.execute({ idClinicalUser: 1 });

    expect(result).toEqual({
        numbers:              expect.any(Object),
        users:                { usersList: [] },
        appointmentsToday:    { appointmentsList: [] },
        appointmentsTomorrow: { appointmentsList: [] },
        appointmentsOther:    { appointmentsList: [] },
        historicalNumbers:    expect.any(Object),
    });
  });

test('Happy path', async () => {
    const fakeNumbers         = { total: 3, discharged: 1, inIntervention: 2 };
    const fakeHistorical      = { total: 10, discharged: 5, inIntervention: 5 };
    const fakeUsers           = [
      { id_user: 1, first_name: 'Ana',    lastname_p: 'López',  lastname_m: 'M' },
      { id_user: 2, first_name: 'Carlos', lastname_p: 'Ruiz',   lastname_m: 'R' },
    ];

    const fakeAppointments    = [
      { id_appointment: 10, day_separation: 'today',    full_name: 'Ana López',   date_time: '2025-06-01T10:00:00' },
      { id_appointment: 11, day_separation: 'tomorrow', full_name: 'Carlos Ruiz', date_time: '2025-06-02T11:00:00' },
      { id_appointment: 12, day_separation: 'other',    full_name: 'María Torres', date_time: '2025-06-05T09:00:00' },
    ];

    usersRepository.fetchNumberUsers.mockResolvedValue([fakeNumbers]);
    usersRepository.fetchAllWithClinical.mockResolvedValue(fakeUsers);
    usersRepository.fetchHistoricalNumberUsers.mockResolvedValue([fakeHistorical]);
    appointmentRepository.fecthAppointmentWithClinical.mockResolvedValue(fakeAppointments);

    const result = await useCase.execute({ idClinicalUser: 5 });


    expect(result).toEqual({
      numbers:              fakeNumbers,
      users:                { usersList: fakeUsers },
      appointmentsToday:    { appointmentsList: [fakeAppointments[0]] },
      appointmentsTomorrow: { appointmentsList: [fakeAppointments[1]] },
      appointmentsOther:    { appointmentsList: [fakeAppointments[2]] },
      historicalNumbers:    fakeHistorical,
    });

    expect(usersRepository.fetchNumberUsers).toHaveBeenCalledWith({ idClinicalUser: 5 });
    expect(usersRepository.fetchAllWithClinical).toHaveBeenCalledWith({ idClinicalUser: 5 });
    expect(usersRepository.fetchHistoricalNumberUsers).toHaveBeenCalledWith({ idClinicalUser: 5 });
    expect(appointmentRepository.fecthAppointmentWithClinical).toHaveBeenCalledWith({ idClinicalUser: 5 });
  });
});