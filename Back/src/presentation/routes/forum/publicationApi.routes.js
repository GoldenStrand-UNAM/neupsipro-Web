const express = require('express');
const {
  apiLimiter,
  publicationLimiter,
} = require('../../../infrastructure/external/rateLimiting');

const PublicationController = require('../../controller/forum/getPublication.controller');
const GetPublicationUseCase = require('../../../application/usecase/forum/getPublicationUseCase');

const PostPublicationController = require('../../controller/forum/postPublication.controller');
const RegPublicationUseCase = require('../../../application/usecase/forum/postPublicationUseCase');

const DeletePublicationUseCase = require('../../../application/usecase/forum/deletePublicationUseCase');
const DeletePublicationController = require('../../controller/forum/deletePublication.controller');

const InteractionRepository = require('../../../infrastructure/repositories/ImpInteractionRepository');
const PublicationRepository = require('../../../infrastructure/repositories/ImpForumRepository');
const UsersRepository = require('../../../infrastructure/repositories/ImpUsersRepository');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const publicationRepository = new PublicationRepository();
  const interactionRepository = new InteractionRepository();
  const userRepository = new UsersRepository();

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const getPublicationUseCase = new GetPublicationUseCase(
    publicationRepository,
    interactionRepository,
    userRepository
  );

  const getPublicationController = new PublicationController(getPublicationUseCase);

  const postPublicationUseCase = new RegPublicationUseCase(publicationRepository);

  const postPublicationController = new PostPublicationController(postPublicationUseCase);

  const deletePublicationUseCase = new DeletePublicationUseCase(
    publicationRepository,
    interactionRepository
  );

  const deletePublicationController = new DeletePublicationController(deletePublicationUseCase);

  router.get(
    '/:idPublication',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => getPublicationController.getPublication(req, res)
  );

  router.post(
    '/',
    authMiddleware.verifyToken,
    publicationLimiter,
    permissionsMiddleware.requirePermission('Forum', 'writing'),
    upload.single('imagen'),
    validateImageMiddleware,
    s3UploadMiddleware,
    (req, res) => postPublicationController.registerPublication(req, res)
  );

  router.delete(
    '/:idPublication',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'eliminate'),
    (req, res) => deletePublicationController.deletePublication(req, res)
  );

  return router;
};
