const clinicalDashboardDTO = require('../../dto/clinicalDashboardDTO');

class GetClinicalUserDashboardUseCase {
  constructor (usersRepository, appointmentRepository) {
    this.usersRepository = usersRepository;
    this.appointmentRepository = appointmentRepository;
  }
  async execute ({idClinicalUser}) {
    const [numberUsers, users, appointments, historicalNumberUsers] = await Promise.all([
      this.usersRepository.fetchNumberUsers({ idClinicalUser }),
      this.usersRepository.fetchAllWithClinical({ idClinicalUser }),
      this.appointmentRepository.fecthAppointmentWithClinical({ idClinicalUser }),
      this.usersRepository.fetchHistoricalNumberUsers({ idClinicalUser }),
    ]);
    let today = [];
    let tomorrow = [];
    let other = [];
    appointments.forEach(appointment => {
      if (appointment.day_separation === 'today') {
        today.push(appointment);
      } else if (appointment.day_separation === 'tomorrow') {
        tomorrow.push(appointment);
      } else {
        other.push(appointment);
      }
    });
    const dto = new clinicalDashboardDTO.clinicalDashboardDTO(
      numberUsers[0],
      users,
      today,
      tomorrow,
      other,
      historicalNumberUsers[0]
    );
    console.log(dto);
    return dto;
  }
}
module.exports = GetClinicalUserDashboardUseCase;
