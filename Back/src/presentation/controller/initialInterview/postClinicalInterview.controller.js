
class postClinicalInterviewController {
  constructor (postClinicalInterviewUseCase) {
    this.postClinicalInterviewUseCase = postClinicalInterviewUseCase;
  }

  async saveClinicalInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const result = await this.postClinicalInterviewUseCase.executeUpdate({
        id_user,
        step,
        subStep: Number(subStep),
        body: req.body,
      });

      res.status(200).json({
        success: true,
        message: 'Clinical interview saved',
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

module.exports = postClinicalInterviewController;