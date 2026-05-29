class postNihController {

  constructor (postNihUseCase) {
    this.useCase = postNihUseCase;
  }

  async postResult (req, res) {
    try {
      const { id_user, id_application } = req.params;
      const { notes }                   = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        notes,
      });

      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[postNihController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = postNihController;