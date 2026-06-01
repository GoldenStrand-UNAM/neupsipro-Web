class modifyStateController {
  constructor (modifyStateUseCase) {
    this.modifyStateUseCase = modifyStateUseCase;
  }

  async modifyState (req, res) {
    try {
      const { id_user } = req.params;
      const { state } = req.body;

      const updated = await this.modifyStateUseCase.execute({
        id_user,
        state,
      });

      return res.status(200).json({
        success: true,
        message: 'Estatus actualizado correctamente',
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

module.exports = modifyStateController;
