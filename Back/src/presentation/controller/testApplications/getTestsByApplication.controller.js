// presentation/controller/tests/getTestsByApplication.controller.js

class getTestsByApplicationController {
  constructor(getTestsByApplicationUseCase) {
    this.getTestsByApplicationUseCase = getTestsByApplicationUseCase;
  }

  async getTests(req, res) {
    const { id_user, id_application } = req.params;

    try {
      const data = await this.getTestsByApplicationUseCase.execute({ id_user, id_application });
      return res.status(200).json({ data });

    } catch (err) {

        
      // Use the status attached by the use case, fallback to 500
      const httpStatus = err.status || 500;
      return res.status(httpStatus).json({ error: err.message });
    }
  }
}

module.exports = getTestsByApplicationController;