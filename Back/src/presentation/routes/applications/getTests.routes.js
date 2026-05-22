const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const impTestResultsRepository        = require('../../../infrastructure/repositories/impTestResultsRepository');
const getTestsByApplicationUseCase    = require('../../../application/usecase/testApplications/getTestsByApplicationUseCase');
const getTestsByApplicationController = require('../../controller/testApplications/getTestsByApplication.controller');

//Banfe

const postBanfeUseCase    = require('../../../application/usecase/testApplications/postBanfeUseCase');
const postBanfeController = require('../../controller/testApplications/postBanfe.controller');
const getBanfeResultUseCase    = require('../../../application/usecase/testApplications/getBanfeUseCase');
const getBanfeResultController = require('../../controller/testApplications/getBanfe.controller');

//AUTH & PERMISSIONS
const JwtService            = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware        = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const testResultsRepo = new impTestResultsRepository();
  const useCase         = new getTestsByApplicationUseCase(testResultsRepo);
  const controller      = new getTestsByApplicationController(useCase);

  const jwtService            = new JwtService();
  const authMiddleware        = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const banfeUseCase    = new postBanfeUseCase(testResultsRepo);
  const banfeController = new postBanfeController(banfeUseCase);
  const getBanfeUseCase    = new getBanfeResultUseCase(testResultsRepo);
  const getBanfeController = new getBanfeResultController(getBanfeUseCase);

  // Only manage the render
  router.get(
    '/users/:id_user/applications/:id_application/tests',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.renderTests(req, res)
  );

  // Only manage the API
  router.get(
    '/api/users/:id_user/applications/:id_application/tests',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.getTests(req, res)
  );

  //========================= BANFE ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/1/results',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => banfeController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/1/results/:id_results',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getBanfeController.getResult(req, res)
  );

  return router;
};
