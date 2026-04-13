// Controller responsible for handling HTTP requests for users list.
class GetUsersListController {
    constructor (GetUsersSummaryUseCase) {
        this.GetUsersSummaryUseCase = GetUsersSummaryUseCase;
    }

    async getUsers (req, res) {
        try {
            // Extract query params 
            const { search = "", page = 1, limit = 10 } = req.query;
            
            //Exceute useCase
            const result = await this.GetUsersSummaryUseCase.execute({ search, page, limit });

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
            res.render("Users/usuarios");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = GetUsersListController;