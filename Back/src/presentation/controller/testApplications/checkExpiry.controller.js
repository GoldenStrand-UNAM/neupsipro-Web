const logger = require('../../../infrastructure/external/logger.service');

class checkExpiryController {

  constructor (checkExpiryUseCase) {
    this.useCase = checkExpiryUseCase;
  }

  async checkExpiry (req, res) {
    logger.debug('checkExpiry: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;

      const result = await this.useCase.execute({ id_user });

      logger.info('checkExpiry: éxito', { userId: req.user?.id, id_user });
      return res.status(200).json({ data: result });

    } catch (err) {
      if (err.status && err.message) {
        logger.warn('checkExpiry: error operacional', { error: err.message, userId: req.user?.id, id_user: req.params.id_user, status: err.status });
        return res.status(err.status).json({ error: err.message });
      }
      logger.error('checkExpiry: error inesperado', { error: err, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = checkExpiryController;
