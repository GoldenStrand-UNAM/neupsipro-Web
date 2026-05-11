class deleteAppointmentUseCase {
  constructor (appointmentRepository) {
    this.appointmentRepository = appointmentRepository;
  }

  async execute ({ id_user }) {
    if (!id_user) {
      throw new Error('id_user es requerido');
    }

    // Verify if the date exists
    const upcoming = await this.appointmentRepository.findUpcomingByUser({ id_user });
    if (!upcoming) {
      throw new Error('No hay una cita próxima para eliminar');
    }
    //delete
    const deleted = await this.appointmentRepository.deleteUpcomingByUser({ id_user });
    if (!deleted) {
      throw new Error('No se pudo eliminar la cita');
    }

    return {
      success: true,
      message: 'Cita eliminada correctamente',
    };
  }
}

module.exports = deleteAppointmentUseCase;