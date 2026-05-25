class checkExpiryController {

  constructor (checkExpiryUseCase) {
    this.useCase = checkExpiryUseCase;
  }

  async checkExpiry (req, res) {
    try {
      const { id_user } = req.params;

      const result = await this.useCase.execute({ id_user });

      return res.status(200).json({ data: result });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      // eslint-disable-next-line no-console
      console.error('[checkExpiryController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = checkExpiryController;
