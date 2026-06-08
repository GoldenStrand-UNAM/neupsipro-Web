const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const ImpTestExportRepository = require('../../../infrastructure/repositories/ImpTestExportRepository');
const ExportTestResultsCsvUseCase = require('../../../application/usecase/testApplications/exportTestResultsCsvUseCase');
const ExportTestResultsCsvController = require('../../controller/testApplications/exportTestResultsCsv.controller');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const testExportRepository = new ImpTestExportRepository();

  const exportTestResultsCsvUseCase = new ExportTestResultsCsvUseCase(testExportRepository);

  const exportTestResultsCsvController = new ExportTestResultsCsvController(exportTestResultsCsvUseCase);

  router.get(
    '/export',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => exportTestResultsCsvController.export(req, res)
  );

  return router;
};
