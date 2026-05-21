const express = require('express');

const impTestResultsRepository        = require('../../../infrastructure/repositories/impTestResultsRepository');
const getTestsByApplicationUseCase    = require('../../../application/usecase/testApplications/getTestsByApplicationUseCase');
const getTestsByApplicationController = require('../../controller/testApplications/getTestsByApplication.controller');

//BANFE

const postBANFEUseCase    = require('../../../application/usecase/testApplications/postBANFEUseCase');
const postBANFEController = require('../../controller/testApplications/postBANFE.controller');
const getBANFEResultUseCase    = require('../../../application/usecase/testApplications/getBANFEUseCase');
const getBANFEResultController = require('../../controller/testApplications/getBANFE.controller');

//WAIS

const postWAISUseCase    = require('../../../application/usecase/testApplications/postWAISUseCase');
const postWAISController = require('../../controller/testApplications/postWAIS.controller');

const getWAISResultUseCase        = require('../../../application/usecase/testApplications/getWAISUseCase');
const getWAISResultController     = require('../../controller/testApplications/getWAIS.controller');

//MOCA

const postMOCAUseCase    = require('../../../application/usecase/testApplications/postMOCAUseCase');
const postMOCAController = require('../../controller/testApplications/postMOCA.controller');

const getMOCAResultUseCase        = require('../../../application/usecase/testApplications/getMOCAUseCase');
const getMOCAResultController     = require('../../controller/testApplications/getMOCA.controller');

//REY

const postREYUseCase    = require('../../../application/usecase/testApplications/postREYUseCase');
const postREYController = require('../../controller/testApplications/postREY.controller');

const getREYResultUseCase  = require('../../../application/usecase/testApplications/getREYUseCase');
const getREYController     = require('../../controller/testApplications/getREY.controller');

//NIH
const postNIHUseCase       = require('../../../application/usecase/testApplications/postNIHUseCase');
const postNIHController    = require('../../controller/testApplications/postNIH.controller');

const getNIHResultUseCase  = require('../../../application/usecase/testApplications/getNIHUseCase');
const getNIHResultController     = require('../../controller/testApplications/getNIH.controller');

//AUTH & PERMISSIONS
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
  const getBANFEUseCase    = new getBANFEResultUseCase(testResultsRepo);
  const getBANFEController = new getBANFEResultController(getBANFEUseCase);

  //WAIS

  const waisUseCase    = new postWAISUseCase(testResultsRepo);
  const waisController = new postWAISController(waisUseCase);

  const getWAISUseCase    = new getWAISResultUseCase(testResultsRepo);
  const getWAISController = new getWAISResultController(getWAISUseCase);

  //MOCA
  const mocaUseCase    = new postMOCAUseCase(testResultsRepo);
  const mocaController = new postMOCAController(mocaUseCase);

  const getMOCAUseCase    = new getMOCAResultUseCase(testResultsRepo);
  const getMOCAController = new getMOCAResultController(getMOCAUseCase);

  //NIH
  const nihUseCase    = new postNIHUseCase(testResultsRepo);
  const nihController = new postNIHController(nihUseCase);

  const getNIHUseCase = new getNIHResultUseCase(testResultsRepo);
  const getNIHController    = new getNIHResultController(getNIHUseCase);

  //REY
  const reyUseCase    = new postREYUseCase(testResultsRepo);
  const reyController = new postREYController(reyUseCase);

  const getREYUseCase = new getREYResultUseCase(testResultsRepo);
  const getREYCtrl    = new getREYController(getREYUseCase);

  //AUTH & PERMISSIONS MIDDLEWARE

  const jwtService            = new JwtService();
  const authMiddleware        = new AuthMiddleware(jwtService);
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

  //========================= BANFE ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/1/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => banfeController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/1/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getBANFEController.getResult(req, res)
  );

  // ======================== WAIS ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/2/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => waisController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/2/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getWAISController.getResult(req, res)
  );

  // ======================== MOCA ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/4/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => mocaController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/4/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getMOCAController.getResult(req, res)
  );

  // ======================== REY ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/3/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('tests', 'consultation'),
    (req, res) => reyController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/3/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getREYCtrl.getResult(req, res)
  );

  // ======================== NIH ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/5/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => nihController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/5/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getNIHController.getResult(req, res)
  );

  // ======================== AUXILIARY ENDPOINTS FOR MOCA & REY ===============================

  router.get(
    '/api/users/:id_user/schooling',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => {
      const { id_user } = req.params;
      testResultsRepo.fetchUserSchooling({ id_user })
        .then(schooling => {
          const map = {
            'Sin schooling': 0,
            'Primaria': 6,
            'Secundaria': 9,
            'Bachillerato': 12,
            'Licenciatura': 16,
            'Posgrado': 18,
          };
          const years = map[schooling] ?? null;
          res.status(200).json({ schooling, years });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );

  // GET REY age for modal
  router.get(
    '/api/users/:id_user/age',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => {
      const { id_user } = req.params;
      testResultsRepo.fetchUserAge({ id_user })
        .then(birthdate => {
          if (!birthdate) return res.status(200).json({ age: null });
          const today = new Date();
          const birth = new Date(birthdate);
          let years = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
          res.status(200).json({ age: years });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );

  return router;
};
