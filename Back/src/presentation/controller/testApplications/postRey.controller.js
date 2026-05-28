class postReyController {

  constructor (postREYUseCase) {
    this.useCase = postREYUseCase;
  }

  async postResult (req, res) {
    try {
      const { id_user, id_application } = req.params;

      const {
        score_rc,  time_rc,
        score_mcp, time_mcp,
        score_mlp, time_mlp,
        notes,
      } = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        score_rc,  time_rc,
        score_mcp, time_mcp,
        score_mlp, time_mlp,
        notes,
      });

      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[postREYController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = postReyController;