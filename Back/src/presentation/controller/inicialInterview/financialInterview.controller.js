const UserDTO = require('../../../application/dto/UserDTO');

class financialInterviewController {
    constructor (financialInterviewUseCase) {
        this.getFinancialInterviewUseCase = financialInterviewUseCase;
    }

    // get financial interview
    async getFinancialInterview (req, res) {
        try {
            const {id_user} = req.params;

            const user = await this.financialInterviewUseCase.execute({id_user});

            const response = user.map(lb => UserDTO.fromEntity(lb));

            return res.status(200).json({
                message: "Entrevista Inicial: Nivel Socioeconómico consultado correctamente",
                data: response,
            });
        } catch (error) {
            return res.status(400).json({
                error: error.message,
            });
        }
    }
}

module.exports = financialInterviewController;