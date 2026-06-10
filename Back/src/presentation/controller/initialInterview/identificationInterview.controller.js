const IdentificationInterviewDTO = require('../../../application/dto/identificationInterviewDTO');

class identificationInterviewController {
  constructor (identificationInterviewUseCase) {
    this.identificationInterviewUseCase = identificationInterviewUseCase;
  }

  async getIdentificationInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const identificationInterview = await this.identificationInterviewUseCase.execute({
        id_user,
        step,
        subStep,
      });

      const response = IdentificationInterviewDTO.fromEntity(identificationInterview);

      res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = identificationInterviewController;