class GetPeerStatsController {
  constructor (getPeerStatsUseCase) {
    this.getPeerStatsUseCase = getPeerStatsUseCase;
  }

  async getPeerStats (request, res) {
    try {
      const stats = await this.getPeerStatsUseCase.execute();
      return res.status(200).json({ data: stats });
    } catch (error) {
      if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({ error: 'Error al consultar las estadísticas.' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = GetPeerStatsController;