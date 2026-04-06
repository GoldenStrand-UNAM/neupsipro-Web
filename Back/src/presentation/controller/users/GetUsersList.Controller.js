class GetUsersListController {
    constructor(GetUsuariosUseCase) {
        this.GetUsuariosUseCase = GetUsuariosUseCase;
    }
 
    async getUsuarios(request, response) {
        try {
            const users = await this.GetUsuariosUseCase.execute();
            response.status(200).json(users);
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    }
}
 
module.exports = GetUsersListController;