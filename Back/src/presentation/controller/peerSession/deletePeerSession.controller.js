class DeletePeerSessionController {
  constructor (deletePeerSessionUseCase) {
    this.deletePeerSessionUseCase = deletePeerSessionUseCase;
  }

  async deletePeerSession (request, res) {
    try {
      const { id_peer_session } = request.params;
      const result = await this.deletePeerSessionUseCase.execute({ id_peer_session });
      return res.status(200).json({ message: 'Sesión eliminada', ...result });
    } catch (error) {
      if (error.notFound) {
        return res.status(404).json({ error: error.message });
      }
      if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({ error: 'Error al eliminar la sesión.' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = DeletePeerSessionController;
