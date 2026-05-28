const logger = require('../../../infrastructure/external/logger.service');

/**
 * Controller for user profile management.
 * It handles the HTTP calls and manages the answers.
 */
class profileController {
  constructor (getProfileUseCase) {
    this.getProfileUseCase = getProfileUseCase;
  }

  async getProfile (req, res) {
    logger.debug('getProfile: inicio', { userId: req.user?.id, targetUserId: req.params.userId });
    try {
      const { userId } = req.params;
      const authenticatedUser = req.user;
      const isLegacyId = /^u-[0-9]+$/.test(userId);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
      if (!isLegacyId && !isUuid) {
        logger.warn('getProfile: formato de ID inválido', { userId: req.user?.id, targetUserId: userId });
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID format',
        });
      }
      const authId = authenticatedUser?.userId || authenticatedUser?.id;
      if (!authId || String(authId) !== String(userId)) {
        logger.warn('getProfile: acceso denegado', { userId: req.user?.id, targetUserId: userId, authId });
        return res.status(403).json({
          success: false,
          message: 'No tienes permiso para ver este perfil',
        });
      }
      const profileDTO = await this.getProfileUseCase.execute(userId);
      if (!profileDTO) {
        logger.warn('getProfile: usuario no encontrado', { userId: req.user?.id, targetUserId: userId });
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      logger.info('getProfile: éxito', { userId: req.user?.id, targetUserId: userId });
      return res.status(200).json({
        success: true,
        data: profileDTO,
      });

    } catch (error) {
      if (
        error.message && (
          error.message.includes('NOT_FOUND') ||
        error.message.includes('not found') ||
        error.message.includes('not a function')
        )
      ) {
        logger.warn('getProfile: usuario no encontrado (catch)', { error: error.message, userId: req.user?.id, targetUserId: req.params.userId });
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
      logger.error('getProfile: error de servidor', { error, userId: req.user?.id, targetUserId: req.params.userId });
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

module.exports = profileController;
