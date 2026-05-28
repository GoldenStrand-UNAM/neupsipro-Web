const logger = require('../../../infrastructure/external/logger.service');

// Controller function it handles HTTP request to reg a new publication
class PostPublicationController {
  constructor (RegPublicationUseCase) {
    this.RegPublicationUseCase = RegPublicationUseCase;
  }

  async registerPublication (request, response) {
    const userId = request.user?.userId;
    logger.debug('registerPublication: inicio', { userId, titulo: request.body?.titulo });
    try {
      const { titulo, contenido } = request.body;
      const id_usuario = request.user.userId;
      const image = request.file ? request.file.s3Location : null;

      const publication = await this.RegPublicationUseCase.execute({
        id_usuario,
        titulo,
        contenido,
        image,
      });

      logger.info('registerPublication: éxito', { userId, publicationId: publication?.id });
      response.status(201).json(publication);
    } catch (error) {
      if (error.message.includes('obligatorio') || error.message.includes('caracteres')) {
        logger.warn('registerPublication: error de validación', { error: error.message, userId });
        return response.status(422).json({ error: error.message });
      }
      logger.error('registerPublication: error', { error, userId });
      response.status(500).json({ error: error.message });
    }
  }
}

module.exports = PostPublicationController;
