class identificationInterviewController {
  constructor (postIdentificationInterviewUseCase) {
    this.postIdentificationInterviewUseCase = postIdentificationInterviewUseCase;
  }

  async saveIdentificationInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const result =
        await this.postIdentificationInterviewUseCase.executeUpdate({
          id_user,
          step,
          subStep: Number(subStep),
          body: req.body,
        });

      res.status(200).json({
        success: true,
        message: 'Identification interview saved',
        data: result,
      });

    } catch (err) {
      res.status(err.status || 500).json({
        success: false,
        error: err.message,
      });
    }
  }
}

module.exports = identificationInterviewController;
