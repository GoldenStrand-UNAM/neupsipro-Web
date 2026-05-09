const express = require('express');

const impTestResultsRepository        = require('../../../infrastructure/repositories/impTestResultsRepository');
const getTestsByApplicationUseCase    = require('../../../application/usecase/testApplications/getTestsByApplicationUseCase');
const getTestsByApplicationController = require('../../controller/testApplications/getTestsByApplication.controller');

//BANFE 

const postBANFEUseCase    = require('../../../application/usecase/testApplications/postBANFEUseCase');
const postBANFEController = require('../../controller/testApplications/postBANFE.controller');


const JwtService            = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware        = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const testResultsRepo = new impTestResultsRepository();
  const useCase         = new getTestsByApplicationUseCase(testResultsRepo);
  const controller      = new getTestsByApplicationController(useCase);

  //BANFE 

  const banfeUseCase    = new postBANFEUseCase(testResultsRepo);
  const banfeController = new postBANFEController(banfeUseCase);

  const jwtService            = new JwtService();
  const authMiddleware        = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  // Only manage the render
  router.get(
    '/usuarios/:id_user/aplicaciones/:id_application/pruebas',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.renderTests(req, res)
  );

  // Only manage the API
  router.get(
    '/api/usuarios/:id_user/aplicaciones/:id_application/pruebas',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => controller.getTests(req, res)
  );

  //BANFE
  router.post(
    '/api/usuarios/:id_user/aplicaciones/:id_application/pruebas/1/resultados',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => banfeController.postResult(req, res)
  );


  return router;
};
