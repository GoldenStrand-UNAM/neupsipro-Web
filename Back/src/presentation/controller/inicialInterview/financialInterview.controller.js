const FinancialInterviewDTO  = require('../../../application/dto/financialInterviewDTO');

class financialInterviewController {
  constructor (financialInterviewUseCase) {
    this.financialInterviewUseCase = financialInterviewUseCase;
  }

  // get financial interview
  async getFinancialInterview (req, res) {

    try {
      const { step, subStep } = req.params;
      const refNumber = req.params.id_user;

      const financialInterview = await this.financialInterviewUseCase.execute({
        refNumber,
        step,
        subStep,
      });

      const response = FinancialInterviewDTO.fromEntity(financialInterview);

      //Successful response
      res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  getFinancialPage (req, res) {
    try {
      res.locals.activePage = 'usuarios';
      res.render('inicialInterview/inicialInterview', {
        id_user: req.params.id_user,
        current_step: 2,
        current_section: 1,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = financialInterviewController;
