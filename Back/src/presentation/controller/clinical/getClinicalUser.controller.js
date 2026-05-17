class ClinicalUserController {
  constructor (getClinicalUserUseCase, getClinicalPatientsUseCase) {
    this.getClinicalUserUseCase = getClinicalUserUseCase;
    this.getClinicalPatientsUseCase = getClinicalPatientsUseCase;
  }

  async getClinicalUser (req, res) {
    try {
      const { id_user } = req.params;
      const user = await this.getClinicalUserUseCase.execute({ id_user });
      return res.render('clinical/consultClinicalUser', {
        activePage: 'clinical',
        usuario: user,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async getPatients (req, res) {
    try {
      const { id_user, page = 1, limit = 10 } = req.query;

      const result = await this.getClinicalPatientsUseCase.execute({
        id_user,
        page,
        limit,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = ClinicalUserController;
