const FinancialInterviewDTO  = require('../../../application/dto/financialInterviewDTO');

class financialInterviewController {
    constructor (financialInterviewUseCase) {
        this.getFinancialInterviewUseCase = financialInterviewUseCase;
    }

    // get financial interview
    async getFinancialInterview (req, res) {
        
        try {
            const {id_user} = req.params;

            const financialInterview = await this.financialInterviewUseCase.execute({id_user});

            const response = FinancialInterviewDTO.fromEntity(financialInterview);
            
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