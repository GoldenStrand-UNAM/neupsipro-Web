const logger = require('../../../infrastructure/external/logger.service');

class GetUserInfoController {
  constructor (getUserInfoUseCase) {
    this.getUserInfoUseCase = getUserInfoUseCase;
  }

  async getClinicalDashboard (request, response) {
    logger.debug('getClinicalDashboard (getUserInfo): inicio', { userId: request.user?.id, idUser: request.params.idUser });
    try {
      const { idUser } = request.params;
      const result = await this.getUserInfoUseCase.execute({ idUser });
      logger.info('getClinicalDashboard (getUserInfo): éxito', { userId: request.user?.id, idUser });
      response.status(200).json(result);
    } catch (error) {
      logger.error('getClinicalDashboard (getUserInfo): error', { error, userId: request.user?.id, idUser: request.params.idUser });
      response.status(500).json({ error: error.message });
    }
  }

}
module.exports = GetUserInfoController;
