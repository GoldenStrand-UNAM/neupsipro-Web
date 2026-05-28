const logger = require('../../../infrastructure/external/logger.service');

class getTestsByApplicationController {
  constructor (getTestsByApplicationUseCase) {
    this.getTestsByApplicationUseCase = getTestsByApplicationUseCase;
  }

  // Handles the view
  renderTests (req, res) {
    logger.debug('renderTests: inicio', { userId: req.user?.id, id_user: req.params.id_user, id_application: req.params.id_application });
    const { id_user, id_application } = req.params;
    return res.render('applications/getTests', { id_user, id_application });
  }

  // Handles the API
  async getTests (req, res) {
    logger.debug('getTests: inicio', { userId: req.user?.id, id_user: req.params.id_user, id_application: req.params.id_application });
    const { id_user, id_application } = req.params;

    try {
      const data = await this.getTestsByApplicationUseCase.execute({ id_user, id_application });
      logger.info('getTests: éxito', { userId: req.user?.id, id_user, id_application });
      return res.status(200).json({ data });

    } catch (err) {
      const httpStatus = err.status || 500;
      if (httpStatus < 500) {
        logger.warn('getTests: error de cliente', { error: err.message, userId: req.user?.id, id_user, id_application, status: httpStatus });
      } else {
        logger.error('getTests: error de servidor', { error: err, userId: req.user?.id, id_user, id_application });
      }
      return res.status(httpStatus).json({ error: err.message });
    }
  }
}

module.exports = getTestsByApplicationController;
