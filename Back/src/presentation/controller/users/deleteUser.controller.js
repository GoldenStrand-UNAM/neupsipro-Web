const logger = require('../../../infrastructure/external/logger.service');

class deleteUserController {
  constructor (deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async deleteUser (req, res) {
    logger.debug('deleteUser: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const result = await this.deleteUserUseCase.execute({ id_user });
      logger.info('deleteUser: éxito', { userId: req.user?.id, id_user });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === 'User not found' ? 404 : 400;
      logger.warn('deleteUser: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user, status });
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deleteUserController;
