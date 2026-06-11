const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
//const FIRepository = require('../../../infrastructure/repositories/financialInterviewRepository');

// Get
const Controller = require('../../controller/permissions/getPermissions.controller');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  //const repository = new FIRepository();

  // GET
 // const useCase = new GetUseCase(repository);
  const controller = new Controller(/*useCase*/);

  router.get(
    '/clinical/:idUser/permissions',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'consultation'),
    (req, res) => controller.getPage(req, res)
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
