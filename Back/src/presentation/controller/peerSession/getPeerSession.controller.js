class GetPeerSessionsController {
  constructor (getPeerSessionsUseCase) {
    this.getPeerSessionsUseCase = getPeerSessionsUseCase;
  }

  async getPeerSessions (request, res) {
    try {
      const { page, limit, from, to } = request.query;
      const result = await this.getPeerSessionsUseCase.execute({ page, limit, from, to });
      return res.status(200).json({ data: result });
    } catch (error) {
      if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({ error: 'Error al consultar el historial.' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = GetPeerSessionsController;