const logger = require('../../../infrastructure/external/logger.service');

class getPublicationController {
  // Constructor method for publication
  constructor (getPublicationUseCase) {
    this.getPublicationUseCase = getPublicationUseCase;
  }

  // Method to get a publication along with its interactions
  async getPublication (request, response) {
    logger.debug('getPublication: inicio', { userId: request.user?.id, idPublication: request.params.idPublication });
    try {
      const { idPublication } = request.params;
      const publication = await this.getPublicationUseCase.execute({ idPublication });
      // Makes sure the dto returned was usefull
      if (publication.dto.success === true) {
        logger.info('getPublication: éxito', { userId: request.user?.id, idPublication });
        response.status(200).json({ success: true, dto: publication.dto });
      }
      else {
        logger.warn('getPublication: publicación no encontrada', { userId: request.user?.id, idPublication });
        response.status(404).json({ success: false, dto: publication.dto });
      }

    } catch (err) {
      logger.error('getPublication: error', { error: err, userId: request.user?.id, idPublication: request.params.idPublication });
      response.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = getPublicationController;
