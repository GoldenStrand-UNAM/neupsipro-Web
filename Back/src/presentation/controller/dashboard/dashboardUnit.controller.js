const logger = require('../../../infrastructure/external/logger.service');

class DashboardController {
  constructor (getSummaryUseCase, getStandByDetailUseCase) {
    this.getSummaryUseCase       = getSummaryUseCase;
    this.getStandByDetailUseCase = getStandByDetailUseCase;
  }

  getDashboardPage (req, res) {
    logger.debug('getDashboardPage: inicio', { userId: req.user?.id });
    try {
      res.locals.activePage = 'home';
      res.render('dashboard/dashboardUnit');
    } catch (error) {
      logger.error('getDashboardPage: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }

  async getSummary (req, res) {
    logger.debug('getSummary: inicio', { userId: req.user?.id });
    try {
      const data = await this.getSummaryUseCase.execute();
      logger.info('getSummary: éxito', { userId: req.user?.id });
      res.status(200).json(data);
    } catch (error) {
      logger.error('getSummary: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }

  async getStandByDetail (req, res) {
    logger.debug('getStandByDetail: inicio', { userId: req.user?.id, reference_number: req.params.reference_number });
    try {
      const { reference_number } = req.params;

      if (!reference_number || String(reference_number).length > 10) {
        logger.warn('getStandByDetail: número de referencia inválido', { userId: req.user?.id, reference_number });
        return res.status(400).json({ error: 'Invalid reference number' });
      }

      const data = await this.getStandByDetailUseCase.execute(String(reference_number));

      if (!data.found) {
        logger.warn('getStandByDetail: usuario no encontrado', { userId: req.user?.id, reference_number });
        return res.status(404).json({ error: 'No stand-by user with that reference number' });
      }

      logger.info('getStandByDetail: éxito', { userId: req.user?.id, reference_number });
      res.status(200).json(data);
    } catch (error) {
      logger.error('getStandByDetail: error', { error, userId: req.user?.id, reference_number: req.params.reference_number });
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = DashboardController;
