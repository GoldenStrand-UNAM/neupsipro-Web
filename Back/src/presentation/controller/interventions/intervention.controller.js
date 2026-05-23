class interventionController {
  constructor (getInterventionUseCase, updateContractUseCase, addSessionUseCase, deleteLastSessionUseCase) {
    this.usecase = getInterventionUseCase;
    this.updateUsecase = updateContractUseCase;
    this.addSessionUC = addSessionUseCase;
    this.deleteSessionUC = deleteLastSessionUseCase;
  }

  async getPage (req, res) {
    try {
      const { id_user } = req.params;
      const intervention = await this.usecase.execute({ id_user });

      return res.render('users/intervention/intervention', {
        activePage: 'usuario',
        idUser: id_user,
        intervention,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateContract (req, res) {
    try {
      const { id_user } = req.params;
      const { contract_link, neuro_profile } = req.body;
      const result = await this.updateUsecase.execute({ id_user, contract_link, neuro_profile });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async addSession (req, res) {
    try {
      const { id_user } = req.params;
      const { session_number, session_date, objectives, development, dqp_task } = req.body;

      const result = await this.addSessionUC.execute({
        id_user, session_number, session_date, objectives, development, dqp_task,
      });
      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteLastSession (req, res) {
    try {
      const { id_user, id_session } = req.params;
      const result = await this.deleteSessionUC.execute({ id_user, id_session });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message.includes('última sesión') ? 409 : 400;
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = interventionController;
