const logger = require('../../../infrastructure/external/logger.service');

class deleteAppointmentController {
  constructor (deleteAppointmentUseCase) {
    this.deleteAppointmentUseCase = deleteAppointmentUseCase;
  }

  async deleteAppointment (req, res) {
    logger.debug('deleteAppointment: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const result = await this.deleteAppointmentUseCase.execute({ id_user });
      logger.info('deleteAppointment: éxito', { userId: req.user?.id, id_user });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === 'No hay una cita próxima para eliminar' ? 404 : 400;
      logger.warn('deleteAppointment: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user, status });
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deleteAppointmentController;
