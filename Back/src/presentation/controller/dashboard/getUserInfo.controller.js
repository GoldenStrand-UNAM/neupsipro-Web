class GetUserInfoController {
  constructor (getUserInfoUseCase) {
    this.getUserInfoUseCase = getUserInfoUseCase;
  }
  async getClinicalDashboard (request, response) {
    try {
      const { idUser } = request.params;
      const result = await this.getUserInfoUseCase.execute({ idUser });
      response.status(200).json(result);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

}
module.exports = GetUserInfoController;
