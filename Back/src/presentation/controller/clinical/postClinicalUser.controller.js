class PostClinicalUserController {
  constructor (PostClinicalUserUseCase) {
    this.PostClinicalUserUseCase = PostClinicalUserUseCase;
  }

  async postClinicalUser (request, res) {
    try {
      // Extract query params
      const { idRole = '3', firstName, lastnameP, lastnameM = null, birthdate, email = null, affiliation, activity, startDate, finishDate, hours = null, username, password, emergencyContactName = null, emergencyContactPhone = null, emergencyContactRelation = null } = request.body;

      const clinicalUser = await this.PostClinicalUserUseCase.execute({
        idRole,
        firstName,
        lastnameP,
        lastnameM,
        birthdate,
        email,
        affiliation,
        activity,
        startDate,
        finishDate,
        hours,
        username,
        password,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelation,
      });
      return res.status(201).json(clinicalUser);
    } catch (error) {
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
