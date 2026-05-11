class createAppointmentUseCase {
  constructor (appointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  async execute ({ id_user, id_clinic_user, issue, date_time }) {
    //validations
    if (!id_user || !id_clinic_user || !issue || !date_time) {
      throw new Error('All fields are required');
    }

    const appointmentDate = new Date(date_time);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Invalid date');
    }
    if (appointmentDate <= new Date()) {
      throw new Error('The appointment must be scheduled for a future date');
    }

    // validate it doesn´t exists a future appointment
    const upcoming = await this.appointmentRepository.findUpcomingByUser({ id_user });
    if (upcoming) {
      throw new Error('This user already has a future appointment scheduled');
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