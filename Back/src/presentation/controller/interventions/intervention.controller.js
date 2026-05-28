const logger = require('../../../infrastructure/external/logger.service');

class interventionController {
  constructor (getInterventionUseCase, updateContractUseCase, addSessionUseCase, deleteLastSessionUseCase) {
    this.usecase = getInterventionUseCase;
    this.updateUsecase = updateContractUseCase;
    this.addSessionUC = addSessionUseCase;
    this.deleteSessionUC = deleteLastSessionUseCase;
  }

  async getPage (req, res) {
    logger.debug('getPage (intervention): inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const intervention = await this.usecase.execute({ id_user });

      logger.info('getPage (intervention): éxito', { userId: req.user?.id, id_user });
      return res.render('users/intervention/intervention', {
        activePage: 'usuario',
        idUser: id_user,
        intervention,
        tutorialModule: 'intervention',
      });
    } catch (error) {
      logger.warn('getPage (intervention): error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({ error: error.message });
    }
  }

  async updateContract (req, res) {
    logger.debug('updateContract: inicio', { userId: req.user?.id, id_user: req.params.id_user });
    try {
      const { id_user } = req.params;
      const { contract_link, neuro_profile } = req.body;
      const result = await this.updateUsecase.execute({ id_user, contract_link, neuro_profile });
      logger.info('updateContract: éxito', { userId: req.user?.id, id_user });
      return res.status(200).json(result);
    } catch (error) {
      logger.warn('updateContract: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({ error: error.message });
    }
  }

  async addSession (req, res) {
    logger.debug('addSession: inicio', { userId: req.user?.id, id_user: req.params.id_user, session_number: req.body?.session_number });
    try {
      const { id_user } = req.params;
      const { session_number, session_date, objectives, development, dqp_task } = req.body;

      const result = await this.addSessionUC.execute({
        id_user, session_number, session_date, objectives, development, dqp_task,
      });
      logger.info('addSession: éxito', { userId: req.user?.id, id_user, session_number });
      return res.status(201).json(result);
    } catch (error) {
      logger.warn('addSession: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user });
      return res.status(400).json({ error: error.message });
    }
  }

  async deleteLastSession (req, res) {
    logger.debug('deleteLastSession: inicio', { userId: req.user?.id, id_user: req.params.id_user, id_session: req.params.id_session });
    try {
      const { id_user, id_session } = req.params;
      const result = await this.deleteSessionUC.execute({ id_user, id_session });
      logger.info('deleteLastSession: éxito', { userId: req.user?.id, id_user, id_session });
      return res.status(200).json(result);
    } catch (error) {
      const status = error.message.includes('última sesión') ? 409 : 400;
      logger.warn('deleteLastSession: error de cliente', { error: error.message, userId: req.user?.id, id_user: req.params.id_user, id_session: req.params.id_session, status });
      return res.status(status).json({ error: error.message });
    }
  }
}

module.exports = interventionController;
