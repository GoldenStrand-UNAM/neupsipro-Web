class EditClinicalUserController {
  constructor (EditClinicalUserUseCase, clinicalUserRepository) {
    this.EditClinicalUserUseCase = EditClinicalUserUseCase;
    this.clinicalUserRepository = clinicalUserRepository;
  }

  async editClinicalUserView (req, res) {
    try {
      const { id_user } = req.params;
      const usuario = await this.clinicalUserRepository.fetchClinicalForEdit({ id_user });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }

      res.locals.activePage = 'clinical';
      res.render('clinical/editClinicalUser', {
        usuario,
        tutorialModule: 'editClinicalUser',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async editClinicalUser (request, res) {
    try {
      const { id_user } = request.params;
      const user = { ...request.body };

      const clinicalUser = await this.EditClinicalUserUseCase.execute(id_user, user);
      return res.status(200).json(clinicalUser);
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        return res.status(409).json({ inUse: 'user' });
      }
      if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({ error: 'Error al modificar usuario.' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = EditClinicalUserController;