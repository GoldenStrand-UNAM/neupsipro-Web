class postREYController {
  constructor (useCase) {
    this.useCase = useCase;
  }

  async postResult (req, res) {
    const { id_user, id_application } = req.params;
    const { score, notes }            = req.body;

    try {
      const data = await this.useCase.execute({ id_user, id_application, score, notes });
      return res.status(200).json({ data });
    } catch (err) {
      const httpStatus = err.status || 500;
      return res.status(httpStatus).json({ error: err.message });
    }
  }
}

module.exports = postREYController;
