// Controller responsible for handling HTTP requests for user dashboard.
class GetClinicalUserDashboardController {
  constructor (getClinicalUserDashboardUseCase) {
    this.getClinicalUserDashboardUseCase = getClinicalUserDashboardUseCase;
  }
  async getClinicalDashboard (request, response) {
    try {
      const { idClinicalUser } = request.params;
      const result = await this.getClinicalUserDashboardUseCase.execute ({ idClinicalUser });
      response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

}
module.exports = GetClinicalUserDashboardController;
