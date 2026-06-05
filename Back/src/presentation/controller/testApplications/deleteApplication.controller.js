class deleteApplicationController {
  constructor (deleteApplicationUseCase) {
    this.useCase = deleteApplicationUseCase;
  }

  async delete (req, res) {
    try {
      const { id_user, id_application } = req.params;
      const result = await this.useCase.execute({ id_user, id_application });
      return res.status(200).json({ data: result });
    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[deleteApplicationController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = deleteApplicationController;
