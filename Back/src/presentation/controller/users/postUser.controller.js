class PostUserController {
  constructor (PostUserUseCase) {
    this.PostUserUseCase = PostUserUseCase;
  }

  async postUser (request, res) {
    try {
      // Extract query params 
      const { idRole = "2", userName, firstName, lastnameP, lastnameM = null, birthdate, password, assigned, phase, basePathology, otherPathology, modality, referenceNumber, amputationDate, amputationLevel, otherLevel, laterality, prosthetist, neuroEntryDate, pairs, sex } = request.body;
      const profilePhoto = request.file ? request.file.s3Location : null;

      const user = await this.PostUserUseCase.execute({
        idRole,
        userName,
        firstName,
        lastnameP,
        lastnameM,
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
        otherLevel,
        laterality,
        prosthetist,
        neuroEntryDate,
        pairs,
        sex
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async postUserPage (req, res) {
    try {
      res.locals.activePage = 'usuario';
      res.render("users/postUser");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports =  PostUserController;