// Controller responsible for handling HTTP requests for list of clinicals.
class GetMenuClinicalUsersController {
  constructor (GetMenuClinicalUsersUseCase) {
    this.GetMenuClinicalUsersUseCase = GetMenuClinicalUsersUseCase;
  }

  async getMenuClinicalUsers (req, res) {
    try {
      //Exceute useCase
      console.log('pasa a controller ->');
      const result = await this.GetMenuClinicalUsersUseCase.execute();
      res.status(200).json(result);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = GetMenuClinicalUsersController;
