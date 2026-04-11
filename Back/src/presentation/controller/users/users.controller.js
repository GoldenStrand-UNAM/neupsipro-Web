const UserDTO = require('../../../application/dto/UserDTO');

class usersController {
    constructor (consultUserUseCase) {
        this.consultUserUseCase = consultUserUseCase;
    }

    // Consult one User
    async getUser (req, res) {
        try {
            const {id_user} = req.params;

            const user = await this.consultUserUseCase.execute({id_user});

            const response = user.map(lb => UserDTO.fromEntity(lb));


            return res.status(200).json({
                message: "Usuario consultado correctamente",
                data: response,
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = usersController;