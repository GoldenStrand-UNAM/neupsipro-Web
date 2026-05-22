class PostClinicalUserController {
  /*constructor (PostClinicalUserUseCase) {
    this.PostClinicalUserUseCase = PostClinicalUserUseCase;
  }*/

  /*async postClinicalUser (request, res) {
    try {
      // Extract query params
      const { idRole = '2', userName, firstName, lastnameP, lastnameM = null, birthdate, password, assigned, phase, basePathology, otherPathology, modality, referenceNumber, amputationDate, amputationLevel, otherLevel, laterality, prosthetist, neuroEntryDate, pairs, sex } = request.body;

      const clinicalUser = await this.PostClinicalUserUseCase.execute({
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
        sex,
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }*/

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