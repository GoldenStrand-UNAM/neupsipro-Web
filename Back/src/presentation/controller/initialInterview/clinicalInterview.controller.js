const ClinicalInterviewDTO = require('../../../application/dto/clinicalInterviewDTO');

class clinicalInterviewController {
  constructor (clinicalInterviewUseCase) {
    this.clinicalInterviewUseCase = clinicalInterviewUseCase;
  }

  async getClinicalInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const clinicalInterview = await this.clinicalInterviewUseCase.execute({
        id_user,
        step,
        subStep,
      });

      const response = ClinicalInterviewDTO.fromEntity(clinicalInterview);

      console.log(response);

      res.status(200).json(response);
    } catch (error) {
      return res.status(error.status || 400).json({
        error: error.message,
      });
    }
  }

  getClinicalPage (req, res) {
    try {
      res.locals.activePage = 'usuarios';
      res.render('initialInterview/clinical/clinicalInterview', {
        id_user: req.params.id_user,
        current_step: 3,
        current_section: 1,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = clinicalInterviewController;