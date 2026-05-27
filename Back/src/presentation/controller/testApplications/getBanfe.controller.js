class GetBanfeController {

  constructor (getBanfeUseCase) {
    this.useCase = getBanfeUseCase;
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
      // eslint-disable-next-line no-console
      console.error('[GetBanfeController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = GetBanfeController;
