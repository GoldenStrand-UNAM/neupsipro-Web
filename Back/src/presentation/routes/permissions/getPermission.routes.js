const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const Repository = require('../../../infrastructure/repositories/ImpPermissionsRepository');

// Controlador y Caso de Uso
const Controller = require('../../controller/permissions/getPermissions.controller');
const GetUseCase = require('../../../application/usecase/permissions/permissionsUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new Repository();
  const useCase = new GetUseCase(repository);
  const controller = new Controller(useCase);

  router.get(
    '/users/:userId/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'consultation'),
    (req, res) => controller.getPermission(req, res)
  );

  router.get(
    '/clinical/:userId/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'consultation'),
    (req, res) => controller.getPage(req, res)
  );

  return router;
};
