class ApplicationsController {
  constructor (postApplicationUseCase) {
    this.postApplicationUseCase = postApplicationUseCase;
  }

  // POST /:id_user/applications
  async createApplication (req, res) {
    try {
      const { id_user }          = req.params;
      const { application_name } = req.body;
      const result = await this.postApplicationUseCase.execute({ id_user, application_name });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(error.status ?? 500).json({ error: error.message });
    }
  }
}

module.exports = ApplicationsController;