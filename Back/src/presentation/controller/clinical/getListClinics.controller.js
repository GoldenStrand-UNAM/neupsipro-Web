const logger = require('../../../infrastructure/external/logger.service');

class listClinicsController {
  constructor (listClinicsUseCase) {
    this.listClinicsUseCase = listClinicsUseCase;
  }

  async listClinics (req, res) {
    logger.debug('listClinics: inicio', { userId: req.user?.id });
    try {
      const clinics = await this.listClinicsUseCase.execute();
      logger.info('listClinics: éxito', { userId: req.user?.id, count: clinics?.length });
      return res.status(200).json(clinics);
    } catch (error) {
      logger.warn('listClinics: error', { error: error.message, userId: req.user?.id });
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = listClinicsController;
