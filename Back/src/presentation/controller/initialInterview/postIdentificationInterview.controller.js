class identificationInterviewController {
  constructor (postIdentificationInterviewUseCase) {
    this.postIdentificationInterviewUseCase = postIdentificationInterviewUseCase;
  }

  async saveIdentificationInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      console.log('[identification PATCH] params:', { id_user, step, subStep });
      console.log('[identification PATCH] body:', req.body);

      const result =
        await this.postIdentificationInterviewUseCase.executeUpdate({
          id_user,
          step,
          subStep: Number(subStep),
          body: req.body,
        });

      console.log('[identification PATCH] success:', result);

      res.status(200).json({
        success: true,
        message: 'Identification interview saved',
        data: result,
      });

    } catch (err) {
      console.error('[identification PATCH] error:', err.status, err.message);
      console.error(err.stack);

      res.status(err.status || 500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = identificationInterviewController;
