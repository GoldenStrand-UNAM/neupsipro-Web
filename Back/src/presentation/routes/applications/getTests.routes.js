const express = require('express');

const impTestResultsRepository        = require('../../../infrastructure/repositories/impTestResultsRepository');
const getTestsByApplicationUseCase    = require('../../../application/usecase/testApplications/getTestsByApplicationUseCase');
const getTestsByApplicationController = require('../../controller/testApplications/getTestsByApplication.controller');

//BANFE 

const postBANFEUseCase    = require('../../../application/usecase/testApplications/postBANFEUseCase');
const postBANFEController = require('../../controller/testApplications/postBANFE.controller');

//WAIS

const postWAISUseCase    = require('../../../application/usecase/testApplications/postWAISUseCase');
const postWAISController = require('../../controller/testApplications/postWAIS.controller');

//MOCA

const postMOCAUseCase    = require('../../../application/usecase/testApplications/postMOCAUseCase');
const postMOCAController = require('../../controller/testApplications/postMOCA.controller');


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

  //WAIS

  const waisUseCase    = new postWAISUseCase(testResultsRepo);
  const waisController = new postWAISController(waisUseCase);


  //MOCA  
  const mocaUseCase    = new postMOCAUseCase(testResultsRepo);
  const mocaController = new postMOCAController(mocaUseCase);

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

  //WAIS
  router.post(
    '/api/usuarios/:id_user/aplicaciones/:id_application/pruebas/2/resultados',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => waisController.postResult(req, res)
  );

  //MOCA
  router.post(
    '/api/usuarios/:id_user/aplicaciones/:id_application/pruebas/4/resultados',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => mocaController.postResult(req, res)
  );

  // GET schooling for a user — used by MoCA modal to display education years
  router.get(
    '/api/usuarios/:id_user/escolaridad',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => {
      const { id_user } = req.params;
      testResultsRepo.fetchUserSchooling({ id_user })
        .then(schooling => {
          console.log('[escolaridad endpoint] schooling:', schooling);
          const map = {
            'Sin escolaridad': 0,
            'Primaria':        6,
            'Secundaria':      9,
            'Bachillerato':    12,
            'Licenciatura':    16,
            'Posgrado':        18,
          };
          const years = map[schooling] ?? null;
          res.status(200).json({ schooling, years });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );



  return router;
};
