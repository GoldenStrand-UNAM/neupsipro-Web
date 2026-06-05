
class EditUserController {
  constructor (editUserUseCase) {
    this.editUserUseCase = editUserUseCase;
  }

  async editUser (req, res) {
    try {
      const data = { ...req.body };
      const { id_user } = req.params;
      const profilePhoto = req.file ? req.file.s3Location : null;

      const user = await this.editUserUseCase.execute({ ...data, id_user, profilePhoto });

      return res.status(200).json(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        return res.status(409).json({
          error: 'Usuario duplicado: ya hay un usuario con ese folio o nombre de usuario.',
        });
      }
      if (error.code !== undefined || error.errno !== undefined) {
        return res.status(409).json({
          error: 'Error al actualizar usuario.',
        });
      }
      return res.status(error.status || 400).json({ error: error.message });
    }
  }
}

module.exports = EditUserController;
