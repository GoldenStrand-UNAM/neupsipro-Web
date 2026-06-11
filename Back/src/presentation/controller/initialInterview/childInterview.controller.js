const ChildInterviewDTO = require('../../../application/dto/childInterviewDTO');

class childInterviewController {
  constructor (childInterviewUseCase) {
    this.childInterviewUseCase = childInterviewUseCase;
  }

  async getChildInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const childInterview = await this.childInterviewUseCase.execute({
        id_user,
        step,
        subStep,
      });

      const response = ChildInterviewDTO.fromEntity(childInterview);
      res.status(200).json(response);
    } catch (error) {
      return res.status(error.status || 400).json({
        error: error.message,
      });
    }
  }

  getChildPage (req, res) {
    try {
      res.locals.activePage = 'usuarios';
      res.render('initialInterview/child/childInterview', {
        id_user: req.params.id_user,
        current_step: 3,
        current_section: 1,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = childInterviewController;