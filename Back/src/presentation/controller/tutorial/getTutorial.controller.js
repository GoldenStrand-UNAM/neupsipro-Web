const logger = require('../../../infrastructure/external/logger.service');

class GetTutorialController {
  constructor (getTutorialUseCase) {
    this.getTutorialUseCase = getTutorialUseCase;
  }

  async getTutorial (req, res) {
    logger.debug('getTutorial: inicio', { userId: req.user?.id, page: req.query.page });
    try {
      const { page } = req.query;
      if (!page) {
        logger.warn('getTutorial: página requerida no proporcionada', { userId: req.user?.id });
        return res.status(400).json({ error: 'Page requerida' });
      }
      const steps = await this.getTutorialUseCase.execute(page);
      logger.info('getTutorial: éxito', { userId: req.user?.id, page });
      return res.status(200).json(steps);
    } catch (error) {
      logger.error('getTutorial: error', { error, userId: req.user?.id, page: req.query.page });
      return res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetTutorialController;
