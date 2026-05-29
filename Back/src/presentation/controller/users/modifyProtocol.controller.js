
class modifyProtocolController {
  constructor (modifyProtocolUseCase) {
    this.modifyProtocolUseCase = modifyProtocolUseCase;
  }

  async modifyProtocol (req, res) {
    try {
      const { id_user } = req.params;
      const { protocol } = req.body;

      const VALID_PROTOCOLS = ['Clinical', 'Research'];

      if (!protocol) {
        return res.status(400).json({ error: 'protocol is required' });
      }

      if (!VALID_PROTOCOLS.includes(protocol)) {
        return res.status(400).json({ error: `Protocolo inválido. Debe ser: ${VALID_PROTOCOLS.join(' o ')}` });
      }

      const updated = await this.modifyProtocolUseCase.execute({
        id_user,
        protocol,
      });

      return res.status(200).json({
        success: true,
        message: 'Protocolo actualizado correctamente',
        user: updated,
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({
        error: error.message,
      });
    }
  }
}

module.exports = modifyProtocolController;