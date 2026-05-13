const express = require('express');

const PublicationController = require('../../controller/forum/getPublication.Controller');
const GetPublicationUseCase =  require('../../../application/usecase/forum/getPublicationUseCase');
const InteractionRepository = require('../../../infrastructure/repositories/ImpInteractionRepository');
const PublicationRepository = require('../../../infrastructure/repositories/ImpForumRepository');
const UsersRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const DeletePublicationUseCase    = require('../../../application/usecase/forum/deletePublicationUseCase');
const DeletePublicationController = require('../../controller/forum/deletePublication.controller');


module.exports = (authUseCase) => {
  const router = express.Router();

  // Calls all of the repositories, implementations, usecases and controllers
  const repository = new PublicationRepository();
  const intRepository = new InteractionRepository();
  const userRepository = new UsersRepository();
  const useCasePublication = new GetPublicationUseCase(repository, intRepository, userRepository);
  const controller = new PublicationController(useCasePublication);

  // Required for auth
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  // Requiered for delete
  const deleteUseCase = new DeletePublicationUseCase(repository, intRepository);
  const deleteController = new DeletePublicationController(deleteUseCase);

  // Route to get a publication by its id.
  router.get (
    '/:idPublication',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => controller.getPublication(req, res)
  );

  router.delete(
    '/:idPublication',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Forum', 'eliminate'),
    (req, res) => deleteController.deletePublication(req, res)
  );

  return router;
};
