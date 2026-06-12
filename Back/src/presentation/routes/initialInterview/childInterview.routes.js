const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const ChIRepository = require('../../../infrastructure/repositories/ImpChildInterviewRepository');

// Get
const ChIController = require('../../controller/initialInterview/childInterview.controller');
const GetChIUseCase = require('../../../application/usecase/initialInterview/childInterviewUseCase');

// Post
const PChIController = require('../../controller/initialInterview/postChildInterview.controller');
const PostChIUseCase = require('../../../application/usecase/initialInterview/postChildInterviewUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  const repository = new ChIRepository();

  const useCase = new GetChIUseCase(repository);
  const controller = new ChIController(useCase);

  const postUseCase = new PostChIUseCase(repository);
  const postController = new PChIController(postUseCase);

  router.get(
    '/child',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getChildPage(req, res)
  );

  router.get(
    '/child/api/:id_user/:subStep',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => {
      req.params.step = 'child';
      controller.getChildInterview(req, res);
    }
  );

  router.patch(
    '/child/api/:id_user/:subStep',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'edit'),
    (req, res) => {
      req.params.step = 'child';
      postController.saveChildInterview(req, res);
    }
  );

  return router;
};