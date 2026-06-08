class deleteUserController {
  constructor (deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase;
  }

  async deleteClinical (req, res) {
    try {
      const { id_user } = req.params;
      const result = await this.deleteUserUseCase.execute({ id_user });
      return res.status(200).json(result);
    } catch (error) {
      console.error('[DeleteClinicalController] error:', error);
      const status = error.message === 'Clinical not found' ? 404 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = deleteUserController;
