const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const FIRepository = require('../../../infrastructure/repositories/financialInterviewRepository');

// Get
const Controller = require('../../controller/initialInterview/financialInterview.controller');
const GetUseCase = require('../../../application/usecase/initialInterview/financialInterviewUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  const repository = new FIRepository();

  // GET
  const useCase = new GetUseCase(repository);
  const controller = new Controller(useCase);

  router.get(
    '/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'consultation'),
    (req, res) => controller.getPermissionsPage(req, res)
  );

  /*router.get(
    '/api/admin/users/:userId/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'consultation'),
    (req, res) => controller.checkPermission(req, res)
  );*/

  return router;
};
