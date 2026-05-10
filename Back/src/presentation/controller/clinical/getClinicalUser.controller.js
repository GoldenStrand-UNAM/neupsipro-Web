class getClinicalUserController {
  constructor (getClinicalUserUseCase) {
    this.getClinicalUserUseCase = getClinicalUserUseCase;
  }

  async getClinicalUser (req, res) {
    try {
      const { id_user } = req.params;
      const user = await this.getClinicalUserUseCase.execute({ id_user });
      return res.render('clinical/consultClinicalUser', {
        activePage: 'usuario',
        usuario: user,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = getClinicalUserController;
