class DashboardController {
  constructor (getSummaryUseCase, getStandByDetailUseCase) {
    this.getSummaryUseCase       = getSummaryUseCase;
    this.getStandByDetailUseCase = getStandByDetailUseCase;
  }

  getDashboardPage (req, res) {
    try {
      res.locals.activePage = 'home';
      res.render('dashboard/dashboardUnit', { tutorialModule: 'dashboardUnit' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSummary (req, res) {
    try {
      const data = await this.getSummaryUseCase.execute();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getStandByDetail (req, res) {
    try {
      const { reference_number } = req.params;

      if (!reference_number || String(reference_number).length > 10) {
        return res.status(400).json({ error: 'Invalid reference number' });
      }

      const data = await this.getStandByDetailUseCase.execute(String(reference_number));

      if (!data.found) {
        return res.status(404).json({ error: 'No stand-by user with that reference number' });
      }

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = DashboardController;
