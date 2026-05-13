class PostBANFEController {

  constructor(postBANFEUseCase) {
    this.useCase = postBANFEUseCase;
  }

  async postResult(req, res) {
    try {
      const { id_user, id_application } = req.params;

      // Destructure the three area scores from the request body
      const { score_orbit_frontal, score_prefrontal_before, score_d_lateral, notes} = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        score_orbit_frontal,
        score_prefrontal_before,
        score_d_lateral,
        notes,
      });

      return res.status(200).json({ data: dto });

    } catch (err) {
      // Operational errors thrown as { status, message } objects
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      // Unexpected errors
      console.error('[PostBANFEController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PostBANFEController;