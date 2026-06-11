const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const Repository = require('../../../infrastructure/repositories/ImpPermissionsRepository');

// Get
const Controller = require('../../controller/permissions/patchPermissions.controller');
const GetUseCase = require('../../../application/usecase/permissions/patchPermissionsUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  const repository = new Repository();

  // GET
  const useCase = new GetUseCase(repository);
  const controller = new Controller(useCase);

  router.patch(
    '/users/:userId/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'edit'),
    (req, res) => controller.patchPermission(req, res)
  );

  return router;
};
