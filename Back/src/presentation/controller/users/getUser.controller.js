const logger = require('../../../infrastructure/external/logger.service');

class getUserController {
  constructor (getUserUseCase) {
    this.getUserUseCase = getUserUseCase;
  }

  async getUser (req, res) {
    logger.debug('getUser: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const user = await this.getUserUseCase.execute({ id_user });
      logger.info('getUser: éxito', { userId: req.user?.id, id_user });
      return res.render('users/consultUser', {
        activePage: 'users',
        usuario: user,
      });
    } catch (error) {
      logger.warn('getUser: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = getUserController;
