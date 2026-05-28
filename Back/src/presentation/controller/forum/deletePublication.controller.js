const logger = require('../../../infrastructure/external/logger.service');

class deletePublicationController {
  constructor (deletePublicationUseCase) {
    this.deletePublicationUseCase = deletePublicationUseCase;
  }

  async deletePublication (req, res) {
    logger.debug('deletePublication: inicio', { userId: req.user?.id, idPublication: req.params.idPublication });
    try {
      const { idPublication } = req.params;
      const result = await this.deletePublicationUseCase.execute({ idPublication });
      logger.info('deletePublication: éxito', { userId: req.user?.id, idPublication });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message === 'Publicación no encontrada' ? 404 : 400;
      logger.warn('deletePublication: error de cliente', { error: error.message, userId: req.user?.id, idPublication: req.params.idPublication, status });
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deletePublicationController;
