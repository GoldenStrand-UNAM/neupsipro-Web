const logger = require('../../../infrastructure/external/logger.service');

class createAppointmentController {
  constructor (createAppointmentUseCase) {
    this.createAppointmentUseCase = createAppointmentUseCase;
  }

  async createAppointment (req, res) {
    logger.debug('createAppointment: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const { id_clinic_user, issue, date_time } = req.body;

      const result = await this.createAppointmentUseCase.execute({
        id_user,
        id_clinic_user,
        issue,
        date_time,
      });

      logger.info('createAppointment: éxito', { userId: req.user?.id, id_user, id_clinic_user });
      return res.status(201).json(result);
    } catch (error) {
      logger.error('createAppointment: error', { error, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = createAppointmentController;
