// const FinancialInterviewDTO  = require('../../../application/dto/financialInterviewDTO');

class financialInterviewController {
  constructor (postFinancialInterviewUseCase) {
    this.postFinancialInterviewUseCase = postFinancialInterviewUseCase;
  }

  // Saves financial interview data and returns a success message or an error message.
  async saveFinancialInterview (req, res) {

    try {
      const { step, subStep } = req.params;
      const refNumber = req.params.id_user;

      const result =
        await this.postFinancialInterviewUseCase.executeUpdate({
          refNumber,
          step,
          subStep: Number(subStep),
          body: req.body,
        });

      res.status(200).json({
        success: true,
        message: 'Financial interview saved',
        data: result,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = financialInterviewController;
