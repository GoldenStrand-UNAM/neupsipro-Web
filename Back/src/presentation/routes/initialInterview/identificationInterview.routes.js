const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const IIRepository = require('../../../infrastructure/repositories/identificationInterviewRepository');

// Get
const IIController = require('../../controller/initialInterview/identificationInterview.controller');
const GetIIUseCase = require('../../../application/usecase/initialInterview/identificationInterviewUseCase');

// Post
const PIIController = require('../../controller/initialInterview/postIdentificationInterview.controller');
const PostIIUseCase = require('../../../application/usecase/initialInterview/postIdentificationInterviewUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new IIRepository();

  // The :step/:subStep pattern is shared with the other initial interview phases,
  // so requests for other steps must fall through to their own router
  const onlyIdentificationStep = (req, res, next) => {
    if (req.params.step === 'identification') return next();
    return next('route');
  };

  // GET
  const useCase = new GetIIUseCase(repository);
  const controller = new IIController(useCase);

  router.get(
    '/api/:id_user/:step/:subStep',
    onlyIdentificationStep,
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getIdentificationInterview(req, res)
  );

  // PATCH
  const postUseCase = new PostIIUseCase(repository);
  const postController = new PIIController(postUseCase);

  router.patch(
    '/api/:id_user/:step/:subStep',
    onlyIdentificationStep,
    authMiddleware.verifyToken,
    userLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'edit'),
    (req, res) => postController.saveIdentificationInterview(req, res)
  );

  return router;
};