const logger = require('../../../infrastructure/external/logger.service');

class ApplicationsController {
  constructor (postApplicationUseCase) {
    this.postApplicationUseCase = postApplicationUseCase;
  }

  // POST /:id_user/applications
  async createApplication (req, res) {
    logger.debug('createApplication: inicio', { userId: req.user?.id, id_user: req.params.id_user, application_name: req.body?.application_name });
    try {
      const { id_user }          = req.params;
      const { application_name } = req.body;
      const result = await this.postApplicationUseCase.execute({ id_user, application_name });
      logger.info('createApplication: éxito', { userId: req.user?.id, id_user, application_name, resultId: result?.id });
      res.status(201).json({ data: result });
    } catch (error) {
      const status = error.status ?? 500;
      if (status < 500) {
        logger.warn('createApplication: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user, status });
      } else {
        logger.error('createApplication: error de servidor', { error, userId: req.user?.id, id_user: req.params.id_user });
      }
      res.status(status).json({ error: error.message });
    }
  }
}

module.exports = ApplicationsController;
