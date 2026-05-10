const clinicalDashboardDTO = require('../../dto/clinicalDashboardDTO');

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
    const dto = new clinicalDashboardDTO.clinicalDashboardDTO(numberUsers[0], users, appointments);
    console.log(dto.users.usersList);
    return dto;
  }
}
module.exports = GetClinicalUserDashboardUseCase;
