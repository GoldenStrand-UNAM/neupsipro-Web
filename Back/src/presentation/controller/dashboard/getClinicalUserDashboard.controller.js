const logger = require('../../../infrastructure/external/logger.service');

// Controller responsible for handling HTTP requests for user dashboard.
class GetClinicalUserDashboardController {
  constructor (getClinicalUserDashboardUseCase) {
    this.getClinicalUserDashboardUseCase = getClinicalUserDashboardUseCase;
  }

  getDashboardView (req, res) {
    logger.debug('getDashboardView: inicio', { userId: req.user?.id });
    try {
      res.locals.activePage = 'dashboard';
      res.render('dashboard/dashboardClinical', {  activePage: 'panel', tutorialModule: 'clinicalDashboard' });

    } catch (error) {
      logger.error('getDashboardView: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }

  async getClinicalDashboard (request, response) {
    logger.debug('getClinicalDashboard: inicio', { userId: request.user?.id, idClinicalUser: request.params.idClinicalUser });
    try {
      const { idClinicalUser } = request.params;
      const result = await this.getClinicalUserDashboardUseCase.execute ({ idClinicalUser });
      logger.info('getClinicalDashboard: éxito', { userId: request.user?.id, idClinicalUser });
      response.status(200).json(result);
    } catch (error) {
      logger.error('getClinicalDashboard: error', { error, userId: request.user?.id, idClinicalUser: request.params.idClinicalUser });
      response.status(500).json({ error: error.message });
    }
  }

}
module.exports = GetClinicalUserDashboardController;
