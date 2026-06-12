const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

// Base imports
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const SystemConfigRepository = require('../../../infrastructure/repositories/systemConfigRepository');

const ConfigController = require('../../controller/config/config.controller');
const GetMinSalaryUseCase = require('../../../application/usecase/config/getMinSalaryUseCase');
const UpdateMinSalaryUseCase = require('../../../application/usecase/config/updateMinSalaryUseCase');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  const repository = new SystemConfigRepository();

  const getUseCase = new GetMinSalaryUseCase(repository);
  const updateUseCase = new UpdateMinSalaryUseCase(repository);
  const controller = new ConfigController(getUseCase, updateUseCase);

  router.get(
    '/min-salary',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'edit'),
    (req, res) => controller.getMinSalary(req, res)
  );

  router.patch(
    '/min-salary',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Permissions', 'edit'),
    (req, res) => controller.updateMinSalary(req, res)
  );

  return router;
};
