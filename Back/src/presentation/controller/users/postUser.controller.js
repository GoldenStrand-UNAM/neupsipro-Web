class PostUserController {
  constructor (PostUserUseCase) {
    this.PostUserUseCase = PostUserUseCase;
  }

  async postUser (request, res) {
    try {
      // Extract query params
      const data = { ...request.body };
      const profilePhoto = request.file ? request.file.s3Location : null;

      const user = await this.PostUserUseCase.execute({ ...data, profilePhoto });
      return res.status(201).json(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        return res.status(409).json({
          error: 'Usuario duplicado: ya hay un usuario con ese folio o usuario.',
        });
      } if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({
          error: 'Error al registrar usuario.',
        });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async postUserPage (req, res) {
    try {
      res.locals.activePage = 'usuario';
      res.render('users/postUser');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports =  PostUserController;
