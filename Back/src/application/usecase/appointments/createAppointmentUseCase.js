class createAppointmentUseCase {
  constructor (appointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  async execute ({ id_user, id_clinic_user, issue, date_time }) {
    //validations
    if (!id_user || !id_clinic_user || !issue || !date_time) {
      throw new Error('Todos los campos son requeridos');
    }

    const appointmentDate = new Date(date_time);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Fecha inválida');
    }

    // validate if the date has already passed
    if (appointmentDate < new Date()) {
      throw new Error('Esta fecha ya pasó, intente una nueva fecha');
    }

    // validate it doesn´t exists a future appointment
    const upcoming = await this.appointmentRepository.findUpcomingByUser({ id_user });
    if (upcoming) {
      throw new Error('Este usuario ya tiene una cita programada para el futuro');
    }
    // creates the relation for the appointment type
    const id_user_relation = await this.appointmentRepository.findOrCreateUserRelation({
      id_user,
      id_clinic_user,
    });
    // creates the appointment
    const idAppointment = await this.appointmentRepository.createAppointment({
      id_user_relation,
      issue,
      date_time,
    });

    return {
      success: true,
      idAppointment,
      message: 'Appointment scheduled successfully',
    };
  }
}

module.exports = createAppointmentUseCase;
