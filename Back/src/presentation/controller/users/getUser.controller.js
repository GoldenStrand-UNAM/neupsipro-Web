class getUserController {
  constructor (getUserUseCase) {
    this.getUserUseCase = getUserUseCase;
  }

  async getUser (req, res) {
    try {
      const { id_user } = req.params;
      const user = await this.getUserUseCase.execute({ id_user });
      return res.render('users/consultUser', {
        activePage: 'users',
        usuario: user,
        tutorialModule: 'consultUser', 
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = getUserController;
