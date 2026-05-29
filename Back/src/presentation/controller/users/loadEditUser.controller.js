class RenderEditUserController {
  constructor (loadEditUserUseCase) {
    this.loadEditUserUseCase = loadEditUserUseCase;
  }
 
  async renderEditUser (req, res) {
    try {
      const { id_user } = req.params;
      const usuario = await this.loadEditUserUseCase.execute({ id_user });
 
      return res.render('users/editUser', {
        activePage: 'users',
        usuario,
      });
    } catch (error) {
      const status = error.status || 400;
      return res.status(status).json({ error: error.message });
    }
  }
}
 
module.exports = RenderEditUserController;
 