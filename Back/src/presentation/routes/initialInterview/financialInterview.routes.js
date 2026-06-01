const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const FIRepository = require('../../../infrastructure/repositories/financialInterviewRepository');

// Get
const FIController = require('../../controller/initialInterview/financialInterview.controller');
const GetFIUseCase = require('../../../application/usecase/initialInterview/financialInterviewUseCase');

// Post
const PFIController = require('../../controller/initialInterview/postFinancialInterview.controller');
const PostFIUseCase = require('../../../application/usecase/initialInterview/postFinancialInterviewUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new FIRepository();

  // GET
  const useCase = new GetFIUseCase(repository);
  const controller = new FIController(useCase);

  router.get(
    '/financial',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getFinancialPage(req, res)
  );

  router.get(
    '/api/:id_user/:step/:subStep',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getFinancialInterview(req, res)
  );

  // PATCH
  const postUseCase = new PostFIUseCase(repository);
  const postController = new PFIController(postUseCase);

  router.patch(
    '/api/:id_user/:step/:subStep',
    authMiddleware.verifyToken,
    userLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'edit'),
    (req, res) => postController.saveFinancialInterview(req, res)
  );

  return router;
};
