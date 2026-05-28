const logger = require('../../../infrastructure/external/logger.service');

class GetBanfeController {

  constructor (getBanfeUseCase) {
    this.useCase = getBanfeUseCase;
  }

  async getResult (req, res) {
    logger.debug('getResult (banfe): inicio', { userId: req.user?.id, id_results: req.params.id_results });
    try {
      const { id_results } = req.params;

      const dto = await this.useCase.execute({ id_results });

      logger.info('getResult (banfe): éxito', { userId: req.user?.id, id_results });
      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        logger.warn('getResult (banfe): error operacional', { error: err.message, userId: req.user?.id, id_results: req.params.id_results, status: err.status });
        return res.status(err.status).json({ error: err.message });
      }
      logger.error('getResult (banfe): error inesperado', { error: err, userId: req.user?.id, id_results: req.params.id_results });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = GetBanfeController;
