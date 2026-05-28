const logger = require('../../../infrastructure/external/logger.service');

class PostBanfeController {

  constructor (postBanfeUseCase) {
    this.useCase = postBanfeUseCase;
  }

  async postResult (req, res) {
    logger.debug('postResult (banfe): inicio', { userId: req.user?.id, id_user: req.params.id_user, id_application: req.params.id_application });
    try {
      const { id_user, id_application } = req.params;

      // Destructure the three area scores from the request body
      const { score_orbit_frontal, score_prefrontal_before, score_d_lateral, notes } = req.body;

      const dto = await this.useCase.execute({
        id_user,
        id_application,
        score_orbit_frontal,
        score_prefrontal_before,
        score_d_lateral,
        notes,
      });

      logger.info('postResult (banfe): éxito', { userId: req.user?.id, id_user, id_application });
      return res.status(200).json({ data: dto });

    } catch (err) {
      // Operational errors thrown as { status, message } objects
      if (err.status && err.message) {
        logger.warn('postResult (banfe): error operacional', { error: err.message, userId: req.user?.id, id_user: req.params.id_user, id_application: req.params.id_application, status: err.status });
        return res.status(err.status).json({ error: err.message });
      }
      logger.error('postResult (banfe): error inesperado', { error: err, userId: req.user?.id, id_user: req.params.id_user, id_application: req.params.id_application });
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = PostBanfeController;
