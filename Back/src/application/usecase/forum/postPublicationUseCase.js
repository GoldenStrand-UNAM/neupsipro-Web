// Forum usecase  validates and registers a new publication
const Publication = require('../../../domain/entity/publication');
const PublicationDTO = require('../../dto/publicationDTO');

class RegPublicationUseCase {
  constructor (ForumRepository) {
    this.ForumRepository = ForumRepository;
  }

  async execute ({ id_usuario, titulo, contenido, image }) {
    if (contenido && contenido.length > 500) {
      throw new Error('El contenido no puede superar los 500 caracteres');
    }
    // Entity validation
    const publication = new Publication ({
      id_usuario,
      titulo,
      contenido,
      image: image || null, // S3 Link or null
    });

    const saved = await this.ForumRepository.save(publication);

    // Map saved into clean DTO for the client
    return PublicationDTO.fromEntity(saved);
  }
}

module.exports = RegPublicationUseCase;