class GetUsersListController {
    constructor(GetUsersSummaryUseCase) {
        this.GetUsersSummaryUseCase = GetUsersSummaryUseCase;
    }

    async getUsers(req, res) {
        try {
            const { search = "", page = 1, limit = 10 } = req.query;
            const result = await this.GetUsersSummaryUseCase.execute({ search, page, limit });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = GetUsersListController;