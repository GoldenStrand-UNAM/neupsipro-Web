
class GetClinicalUserDashboardUseCase {
  constructor (usersRepository, appointmentRepository) {
    this.usersRepository = usersRepository;
    this.appointmentRepository = appointmentRepository;
  }
  async execute ({idClinicalUser}) {
    const [numberUsers, users, apointments] = await Promise.all([
      this.usersRepository.fetchNumberUsers({ idClinicalUser }),
      this.usersRepository.fetchAllWithClinical({ idClinicalUser }),
      this.appointmentRepository.fecthAppointmentWithClinical({ idClinicalUser }),
    ]);
  }
}
module.exports = GetClinicalUserDashboardUseCase;
