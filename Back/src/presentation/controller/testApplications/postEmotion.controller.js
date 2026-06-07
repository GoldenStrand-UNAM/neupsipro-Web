class postEmotionController {

  constructor (postEmotionUseCase) {
    this.useCase = postEmotionUseCase;
  }

  async postResult (req, res) {
    try {
      const { id_user, id_application }                            = req.params;
      const { score_anxiety_beck, score_depression_beck, notes }  = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        score_anxiety_beck,
        score_depression_beck,
        notes,
      });

      return res.status(200).json({ data: dto });

    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({ error: err.message });
      }
      console.error('[postEmotionController]', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = postEmotionController;
