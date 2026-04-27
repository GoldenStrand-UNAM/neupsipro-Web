
// Controller function it handles HTTP request to reg a new publication
class PostPublicationController {
  constructor(RegPublicationUseCase) {
    this.RegPublicationUseCase = RegPublicationUseCase;
  }

  async registerPublication(request, response) {
    try {
      const { titulo, contenido } = request.body;
      const id_usuario = request.body.id_usuario || 1; // JWT Auth later
      const image = request.file ? request.file.s3Location : null;


      const publication = await this.RegPublicationUseCase.execute({
        id_usuario,
        titulo,
        contenido,
        image
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

module.exports = PostPublicationController;