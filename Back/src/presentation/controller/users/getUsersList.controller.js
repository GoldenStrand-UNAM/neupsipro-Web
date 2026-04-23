// Controller responsible for handling HTTP requests for users list.
class GetUsersListController {
    constructor (GetUsersListUseCase) {
        this.GetUsersListUseCase = GetUsersListUseCase;
    }

    async getUsers (req, res) {
        try {
            // Extract query params 
            const { search = "", page = 1, limit = 10 } = req.query;

            // Sanitize search input
            const safeSearch = String(search).slice(0, 100);
            
            //Exceute useCase
            const result = await this.GetUsersListUseCase.execute({ search: safeSearch, page, limit });

            //Successful response
            res.status(200).json(result);
        } catch (error) {
            // Handle errors
            res.status(500).json({ error: error.message });
        }
    }
    getUsersPage (req, res) {
        try {
            res.locals.activePage = 'usuarios';
            res.render("users/consultUsersList");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = GetUsersListController;