const logger = require('../../../infrastructure/external/logger.service');

// Controller responsible for handling HTTP requests for users list.
class GetUsersListController {
  constructor (GetUsersListUseCase) {
    this.GetUsersListUseCase = GetUsersListUseCase;
  }

  async getUsers (req, res) {
    logger.debug('getUsers: inicio', { userId: req.user?.id, query: req.query });
    try {
      // Extract query params
      const { search = '', page = 1, limit = 10 } = req.query;

      if (String(search).length > 100) {
        logger.warn('getUsers: búsqueda demasiado larga', { userId: req.user?.id, searchLength: String(search).length });
        return res.status(429).json({ error: 'Search too long' });
      }

      // Sanitize search input
      const safeSearch = String(search).slice(0, 100);

      const safePage = Math.max(1, parseInt(page) || 1);
      const safeLimit = Math.max(1, parseInt(limit) || 10);

      //Exceute useCase
      const result = await this.GetUsersListUseCase.execute ({

        search: safeSearch, page: safePage, limit: safeLimit,
      });

      logger.info('getUsers: éxito', { userId: req.user?.id, page: safePage, limit: safeLimit });
      //Successful response
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      logger.error('getUsers: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }

  getUsersPage (req, res) {
    logger.debug('getUsersPage: inicio', { userId: req.user?.id });
    try {
      res.locals.activePage = 'users';
      res.render('users/consultUsersList', { tutorialModule: 'usersList' });
    } catch (error) {
      logger.error('getUsersPage: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetUsersListController;
