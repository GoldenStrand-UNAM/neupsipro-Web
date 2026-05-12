// Controller responsible for handling HTTP requests for user dashboard.
class GetClinicalUserDashboardController {
  constructor (getClinicalUserDashboardUseCase) {
    this.getClinicalUserDashboardUseCase = getClinicalUserDashboardUseCase;
  }

  getDashboardView (req, res) {
    try {
      res.locals.activePage = 'dashboard';
      res.render('dashboard/dashboardClinical');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClinicalDashboard (request, response) {
    try {
      const { idClinicalUser } = request.params;
      const result = await this.getClinicalUserDashboardUseCase.execute ({ idClinicalUser });
      console.log("RESULT");
      console.log(result);
      response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

}
module.exports = GetClinicalUserDashboardController;
