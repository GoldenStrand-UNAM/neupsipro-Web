// Forum usecase  validates and registers a new publication
const Publication = require('../../domain/entity/Publication');
const PublicationDTO = require('../dto/PublicationDTO');

class RegPublicationUseCase {
  constructor(forumRepository) {
    this.forumRepository = forumRepository;
  }

  async execute({ id_usuario, titulo, contenido, imagenes }) {
    // Entity validation 
    const publication = new Publication({
      id_usuario,
      titulo,
      contenido,
      imagenes: imagenes || null, // S3 Link or null
    });

    const saved = await this.forumRepository.save(publication);

    // Map saved row into clean DTO for the client
    return PublicationDTO.fromEntity(saved);
  }
}

module.exports = RegPublicationUseCase;