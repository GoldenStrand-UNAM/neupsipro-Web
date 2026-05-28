const logger = require('../../../infrastructure/external/logger.service');

// Controller responsible for handling HTTP requests for users list.
class GetUsersListClinicalController {
  constructor (GetUsersClinicalListUseCase) {
    this.GetUsersClinicalListUseCase = GetUsersClinicalListUseCase;
  }

  async getUsers (req, res) {
    logger.debug('getUsers (clinical): inicio', { userId: req.user?.id, query: req.query });
    try {
      // Extract query params
      const { search = '', page = 1, limit = 10 } = req.query;

      // Sanitize search input
      const safeSearch = String(search).slice(0, 100);

      const safePage = Math.max(1, parseInt(page) || 1);
      const safeLimit = Math.max(1, parseInt(limit) || 10);

      //Exceute useCase
      const result = await this.GetUsersClinicalListUseCase.execute({ search: safeSearch, page: safePage, limit: safeLimit });

      logger.info('getUsers (clinical): éxito', { userId: req.user?.id, page: safePage, limit: safeLimit });
      //Successful response
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      logger.error('getUsers (clinical): error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }

  getUsersPage (req, res) {
    logger.debug('getUsersPage (clinical): inicio', { userId: req.user?.id });
    try {
      res.locals.activePage = 'clinical';
      res.render('clinical/consultUsersClinicalList');
    } catch (error) {
      logger.error('getUsersPage (clinical): error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetUsersListClinicalController;
