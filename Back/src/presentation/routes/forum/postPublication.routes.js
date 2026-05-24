const express = require('express');
const ImpForumRepository = require('../../../infrastructure/repositories/ImpForumRepository');
const PostPublicationController = require('../../controller/forum/postPublication.controller');
const RegPublicationUseCase = require('../../../application/usecase/forum/postPublicationUseCase');
const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');
const { apiLimiter , publicationLimiter } = require('../../../infrastructure/external/rateLimiting');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const repository = new ImpForumRepository();
  const useCase = new RegPublicationUseCase(repository);
  const controller = new PostPublicationController(useCase);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/forum/post',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'writing'),
    // added the tutorial module variable to identify the tutorial in the frontend
    (req, res) => res.render('forum/postPublication', { activePage: 'forum', tutorialModule: 'postPublication', })
  );


  router.post( 
    '/forum/post',
    authMiddleware.verifyToken,
    publicationLimiter,
    permissionsMiddleware.requirePermission('Forum', 'writing'),
    upload.single('imagen'),
    validateImageMiddleware,
    s3UploadMiddleware,
    (req, res) => controller.registerPublication(req, res)
  );

  return router;
};
