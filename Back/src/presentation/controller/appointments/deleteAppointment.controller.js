class deleteAppointmentController {
  constructor (deleteAppointmentUseCase) {
    this.deleteAppointmentUseCase = deleteAppointmentUseCase;
  }

  async deleteAppointment (req, res) {
    try {
      const { id_user } = req.params;
      const result = await this.deleteAppointmentUseCase.execute({ id_user });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === 'No hay una cita próxima para eliminar' ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deleteAppointmentController;