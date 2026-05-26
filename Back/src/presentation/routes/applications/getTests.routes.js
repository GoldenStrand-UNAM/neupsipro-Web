const express = require('express');

const impTestResultsRepository        = require('../../../infrastructure/repositories/impTestResultsRepository');
const getTestsByApplicationUseCase    = require('../../../application/usecase/testApplications/getTestsByApplicationUseCase');
const getTestsByApplicationController = require('../../controller/testApplications/getTestsByApplication.controller');

//AUTH & PERMISSIONS
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const testResultsRepo = new impTestResultsRepository();
  const useCase         = new getTestsByApplicationUseCase(testResultsRepo);
  const controller      = new getTestsByApplicationController(useCase);

  //AUTH & PERMISSIONS MIDDLEWARE

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  // Only manage the render
  router.get(
    '/users/:id_user/applications/:id_application/tests',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.renderTests(req, res)
  );

  // Only manage the API
  router.get(
    '/api/users/:id_user/applications/:id_application/tests',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.getTests(req, res)
  );

  return router;
};
