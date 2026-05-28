const logger = require('../../../infrastructure/external/logger.service');

// Controller responsible for handling HTTP requests for list of clinicals.
class GetMenuClinicalUsersController {
  constructor (GetMenuClinicalUsersUseCase) {
    this.GetMenuClinicalUsersUseCase = GetMenuClinicalUsersUseCase;
  }

  async getMenuClinicalUsers (req, res) {
    logger.debug('getMenuClinicalUsers: inicio', { userId: req.user?.id });
    try {
      //Exceute useCase
      const result = await this.GetMenuClinicalUsersUseCase.execute();
      logger.info('getMenuClinicalUsers: éxito', { userId: req.user?.id });
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      logger.error('getMenuClinicalUsers: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetMenuClinicalUsersController;
