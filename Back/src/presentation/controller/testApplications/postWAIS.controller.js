class postWAISController {

  constructor (postWAISUseCase) {
    this.useCase = postWAISUseCase;
  }

  async postResult (req, res) {
    try {
      const { id_user, id_application } = req.params;

      const {
        score_com_verbal,
        score_razon_perceptual,
        score_mem_work,
        score_velo_proce,
        score_total,
        notes,
      } = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        score_com_vocal: score_com_verbal,
        score_com_verbal,
        score_razon_perceptual,
        score_mem_work,
        score_velo_proce,
        score_total,
        notes,
      });

      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[postWAISController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = postWAISController;
