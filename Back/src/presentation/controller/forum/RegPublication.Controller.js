const RegPublicationUseCase = require('../../../application/usecase/regPublicationUseCase');

// Controller function, handles HTTP request to reg a new publication
class RegPublicationController {
  constructor(RegPublicationUseCase) {
    this.RegPublicationUseCase = RegPublicationUseCase;
  }

  async registerPublication(request, response) {
    try {
      const { titulo, contenido } = request.body;
      const id_usuario = request.body.id_usuario || 1; // JWT Auth later
      const imagenPath = request.file ? request.file.path : null;

      const publication = await this.RegPublicationUseCase.execute({
        id_usuario,
        titulo,
        contenido,
        imagenPath,
      });

      response.status(201).json(publication);
    } catch (error) {
      if (error.message.includes('obligatorio') || error.message.includes('caracteres')) {
        return response.status(422).json({ error: error.message });
      }
      response.status(500).json({ error: error.message });
    }
  }
}

module.exports = RegPublicationController;
