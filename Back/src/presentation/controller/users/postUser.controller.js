const logger = require('../../../infrastructure/external/logger.service');

class PostUserController {
  constructor (PostUserUseCase) {
    this.PostUserUseCase = PostUserUseCase;
  }

  async postUser (request, res) {
    logger.debug('postUser: inicio', { userId: request.user?.id, userName: request.body?.userName, idRole: request.body?.idRole });
    try {
      // Extract query params
      const { idRole = '2', userName, firstName, lastnameP, lastnameM = null, email = null, birthdate, password, assigned, phase, basePathology, otherPathology, modality, referenceNumber, amputationDate, amputationLevel, laterality, prosthetist, neuroEntryDate, pairs, sex, phone = null } = request.body;
      const profilePhoto = request.file ? request.file.s3Location : null;

      const user = await this.PostUserUseCase.execute({
        idRole,
        userName,
        firstName,
        lastnameP,
        lastnameM,
        email,
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
        phone,
      });
      logger.info('postUser: éxito', { userId: request.user?.id, userName, idRole, newUserId: user?.id });
      return res.status(201).json(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
        logger.warn('postUser: usuario duplicado', { error: error.message, userId: request.user?.id, userName: request.body?.userName });
        return res.status(409).json({
          error: 'Usuario duplicado: ya hay un usuario con ese folio o usuario.',
        });
      } if (error.code !== undefined || error.errno !== undefined) {
        logger.warn('postUser: error de base de datos', { error: error.message, userId: request.user?.id, userName: request.body?.userName });
        return res.status(409).json({
          error: 'Error al registrar usuario.',
        });
      }
      logger.warn('postUser: error de cliente', { error: error.message, userId: request.user?.id, userName: request.body?.userName });
      return res.status(400).json({ error: error.message });
    }
  }

  async postUserPage (req, res) {
    logger.debug('postUserPage: inicio', { userId: req.user?.id });
    try {
      res.locals.activePage = 'usuario';
      res.render('users/postUser');
    } catch (error) {
      logger.error('postUserPage: error', { error, userId: req.user?.id });
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports =  PostUserController;
