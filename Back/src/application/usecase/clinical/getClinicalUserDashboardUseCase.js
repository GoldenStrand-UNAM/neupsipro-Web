
class GetClinicalUserDashboardUseCase {
  constructor (usersRepository, appointmentRepository) {
    this.usersRepository = usersRepository;
    this.appointmentRepository = appointmentRepository;
  }
  async execute ({idClinicalUser}) {
    const [numberUsers, users, appointments] = await Promise.all([
      this.usersRepository.fetchNumberUsers({ idClinicalUser }),
      this.usersRepository.fetchAllWithClinical({ idClinicalUser }),
      this.appointmentRepository.fecthAppointmentWithClinical({ idClinicalUser }),
    ]);

    console.log(numberUsers);
    console.log(users);
    console.log(appointments);
  }
}
module.exports = GetClinicalUserDashboardUseCase;
