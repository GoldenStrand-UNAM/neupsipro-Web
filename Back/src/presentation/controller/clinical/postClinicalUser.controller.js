class PostClinicalUserController {
  constructor (PostClinicalUserUseCase) {
    this.PostClinicalUserUseCase = PostClinicalUserUseCase;
  }

  async postClinicalUser (request, res) {
    try {
      // Extract query params
      const user = { ...request.body };

      const clinicalUser = await this.PostClinicalUserUseCase.execute(user);
      return res.status(201).json(clinicalUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        return res.status(409).json({
          inUse: 'user',
        });
      } if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({
          error: 'Error al registrar usuario.',
        });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  postUser (req, res) {
    try {
      res.locals.activePage = 'clinical';
      res.render('clinical/postClinicalUser');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports =  PostClinicalUserController;