
class postChildInterviewController {
  constructor (postChildInterviewUseCase) {
    this.postChildInterviewUseCase = postChildInterviewUseCase;
  }

  async saveChildInterview (req, res) {
    try {
      const { id_user, step, subStep } = req.params;

      const result = await this.postChildInterviewUseCase.executeUpdate({
        id_user,
        step,
        subStep: Number(subStep),
        body: req.body,
      });

      res.status(200).json({
        success: true,
        message: 'Child interview saved',
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

module.exports = postChildInterviewController;