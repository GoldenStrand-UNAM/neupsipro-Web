// presentation/controller/tests/getTestsByApplication.controller.js

class getTestsByApplicationController {
  constructor (getTestsByApplicationUseCase) {
    this.getTestsByApplicationUseCase = getTestsByApplicationUseCase;
  }
  // Handles the view
  renderTests (req, res) {
    const { id_user, id_application } = req.params;
    return res.render('tests/testList', { id_user, id_application });
  }

  // Handles the API
  async getTests (req, res) {
    const { id_user, id_application } = req.params;

    try {
      const data = await this.useCase.execute({ id_user, id_application });
      return res.status(200).json({ data });

    } catch (err) {
      const httpStatus = err.status || 500;
      return res.status(httpStatus).json({ error: err.message });
    }
  }
}

module.exports = getTestsByApplicationController;
