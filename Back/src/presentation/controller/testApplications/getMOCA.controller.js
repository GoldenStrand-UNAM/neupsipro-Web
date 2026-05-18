class getMOCAController {

  constructor (getMOCAResultUseCase) {
    this.useCase = getMOCAResultUseCase;
  }

  async getResult (req, res) {
    try {
      const { id_results } = req.params;

      const dto = await this.useCase.execute({ id_results });

      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[getMOCAController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = getMOCAController;
