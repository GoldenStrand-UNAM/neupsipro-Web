const logger = require('../../../infrastructure/external/logger.service');

class ClinicalUserController {
  constructor (getClinicalUserUseCase, getClinicalPatientsUseCase) {
    this.getClinicalUserUseCase = getClinicalUserUseCase;
    this.getClinicalPatientsUseCase = getClinicalPatientsUseCase;
  }

  async getClinicalUser (req, res) {
    logger.debug('getClinicalUser: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const user = await this.getClinicalUserUseCase.execute({ id_user });
      logger.info('getClinicalUser: éxito', { userId: req.user?.id, id_user });
      return res.render('clinical/consultClinicalUser', {
        activePage: 'clinical',
        usuario: user,
      });
    } catch (error) {
      logger.warn('getClinicalUser: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getPatients (req, res) {
    logger.debug('getPatients: inicio', { userId: req.user?.id, id_user: req.query.id_user });
    try {
      const { id_user, page = 1, limit = 10 } = req.query;

      const result = await this.getClinicalPatientsUseCase.execute({
        id_user,
        page,
        limit,
      });

      logger.info('getPatients: éxito', { userId: req.user?.id, id_user, page, limit });
      res.status(200).json(result);
    } catch (error) {
      logger.error('getPatients: error', { error, userId: req.user?.id, id_user: req.query.id_user });
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = ClinicalUserController;
