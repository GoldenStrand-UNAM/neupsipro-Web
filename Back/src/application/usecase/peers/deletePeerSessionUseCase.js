class DeletePeerSessionUseCase {
  constructor (peerSessionRepository) {
    this.peerSessionRepository = peerSessionRepository;
  }

  async execute ({ id_peer_session: idPeerSession }) {
    if (!idPeerSession)
      throw new Error('El identificador de la sesión es obligatorio');

    const deleted = await this.peerSessionRepository.deleteSession(idPeerSession);

    if (!deleted) {
      const error = new Error('La sesión no existe');
      error.notFound = true;
      throw error;
    }

    return { success: true };
  }
}

module.exports = DeletePeerSessionUseCase;
