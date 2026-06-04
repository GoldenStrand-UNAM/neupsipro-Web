const { deleteFromS3 } = require('../../../infrastructure/external/s3.config');

class deletePublicationUseCase {
  constructor (forumRepository, interactionRepository) {
    this.forumRepository = forumRepository;
    this.interactionRepository = interactionRepository;
  }

  async execute ({ idPublication }) {
    if (!idPublication) throw new Error('idPublication es requerido');

    // check if publication exists
    const publication = await this.forumRepository.findById({ idPublication });
    if (!publication) throw new Error('Publicación no encontrada');

    // delete interactions
    await this.interactionRepository.deleteAllFromPublication({ idPublication });

    // delete publication
    const deleted = await this.forumRepository.deletePublication({ idPublication });
    if (!deleted) throw new Error('No se pudo eliminar la publicación');

    // delete image
    if (publication.image) {
      await deleteFromS3(publication.image);
    }

    return { success: true, message: 'Publicación eliminada' };
  }
}

module.exports = deletePublicationUseCase;
