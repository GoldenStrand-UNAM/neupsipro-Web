const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpDashboardRepository = require('../../../infrastructure/repositories/ImpDashboardUnitRepository');
const GetDashboardSummaryUseCase = require('../../../application/usecase/dashboard/getDashboardUnitUseCase');
const GetStandByDetailUseCase = require('../../../application/usecase/dashboard/getStandByDetailUseCase');
const DashboardController = require('../../controller/dashboard/dashboardUnit.controller');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpDashboardRepository();
  const summaryUseCase = new GetDashboardSummaryUseCase(repository);
  const standByDetailUseCase = new GetStandByDetailUseCase(repository);
  const controller = new DashboardController(summaryUseCase, standByDetailUseCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/dashboard',
    authMiddleware.verifyToken,     apiLimiter, permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getDashboardPage(req, res)
  );

  router.get(
    '/api/dashboard/summary',
    authMiddleware.verifyToken,     apiLimiter, permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getSummary(req, res)
  );

  router.get(
    '/api/dashboard/standby/:reference_number',
    authMiddleware.verifyToken,     apiLimiter, permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getStandByDetail(req, res)
  );

  return router;
};
