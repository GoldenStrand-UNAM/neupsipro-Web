class GetTutorialController {
  constructor(getTutorialUseCase) {
    this.getTutorialUseCase = getTutorialUseCase;
  }

  async getTutorial(req, res) {
    try {
      const { page } = req.query;
      if (!page) return res.status(400).json({ error: 'Page requerida' });
      const steps = await this.getTutorialUseCase.execute(page);
      return res.status(200).json(steps);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetTutorialController;