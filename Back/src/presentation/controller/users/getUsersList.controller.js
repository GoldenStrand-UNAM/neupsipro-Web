// Controller responsible for handling HTTP requests for users list.
class GetUsersListController {
  constructor (GetUsersListUseCase) {
    this.GetUsersListUseCase = GetUsersListUseCase;
  }

  async getUsers (req, res) {
    try {
      // Extract query params
      const { search = '', status = '', protocol = '', page = 1, limit = 10 } = req.query;

      if (String(search).length > 100) {
        return res.status(429).json({ error: 'Search too long' });
      }

      // Sanitize search input
      const safeSearch = String(search).slice(0, 100);

      const safePage = Math.max(1, parseInt(page) || 1);
      const safeLimit = Math.max(1, parseInt(limit) || 10);

      //Exceute useCase
      const result = await this.GetUsersListUseCase.execute ({

        search: safeSearch, status, protocol, page: safePage, limit: safeLimit,
      });

      //Successful response
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  }
  getUsersPage (req, res) {
    try {
      res.locals.activePage = 'users';
      res.render('users/consultUsersList', { tutorialModule: 'usersList' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetUsersListController;
