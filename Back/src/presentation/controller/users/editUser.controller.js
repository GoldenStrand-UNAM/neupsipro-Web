
class EditUserController {
  constructor (editUserUseCase) {
    this.editUserUseCase = editUserUseCase;
  }

  async editUser (req, res) {
    try {
      const {
        userName,
        firstName,
        lastnameP,
        lastnameM     = null,
        email         = null,
        phone         = null,
        birthdate,
        password      = null,
        assigned,
        phase,
        basePathology,
        otherPathology,
        modality,
        referenceNumber,
        amputationDate,
        amputationLevel,
        laterality,
        prosthetist,
        neuroEntryDate,
        pairs,
        sex,
      } = req.body;

      const { id_user } = req.params;
      const profilePhoto = req.file ? req.file.s3Location : null;

      const user = await this.editUserUseCase.execute({
        id_user,
        userName,
        firstName,
        lastnameP,
        lastnameM,
        email,
        phone,
        birthdate,
        password,
        assigned,
        phase,
        basePathology,
        otherPathology,
        modality,
        profilePhoto,
        referenceNumber,
        amputationDate,
        amputationLevel,
        laterality,
        prosthetist,
        neuroEntryDate,
        pairs,
        sex,
      });

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
