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

//Wais

const postWaisUseCase    = require('../../../application/usecase/testApplications/postWaisUseCase');
const postWaisController = require('../../controller/testApplications/postWais.controller');

const getWaisResultUseCase        = require('../../../application/usecase/testApplications/getWaisUseCase');
const getWaisResultController     = require('../../controller/testApplications/getWais.controller');

//Rey

const postReyUseCase    = require('../../../application/usecase/testApplications/postReyUseCase');
const postReyController = require('../../controller/testApplications/postRey.controller');

const getReyResultUseCase  = require('../../../application/usecase/testApplications/getReyUseCase');
const getReyController     = require('../../controller/testApplications/getRey.controller');

//AUTH & PERMISSIONS
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const testResultsRepo = new impTestResultsRepository();
  const useCase         = new getTestsByApplicationUseCase(testResultsRepo);
  const controller      = new getTestsByApplicationController(useCase);

  //AUTH & PERMISSIONS MIDDLEWARE

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  //Banfe
  const banfeUseCase    = new postBanfeUseCase(testResultsRepo);
  const banfeController = new postBanfeController(banfeUseCase);
  const getBanfeUseCase    = new getBanfeResultUseCase(testResultsRepo);
  const getBanfeController = new getBanfeResultController(getBanfeUseCase);

  //Wais
  const waisUseCase    = new postWaisUseCase(testResultsRepo);
  const waisController = new postWaisController(waisUseCase);

  const getWaisUseCase    = new getWaisResultUseCase(testResultsRepo);
  const getWaisController = new getWaisResultController(getWaisUseCase);

  //Rey

  const postReyUseCase    = require('../../../application/usecase/testApplications/postReyUseCase');
  const postReyController = require('../../controller/testApplications/postRey.controller');

  const getReyResultUseCase  = require('../../../application/usecase/testApplications/getReyUseCase');
  const getReyController     = require('../../controller/testApplications/getRey.controller');

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
    (req, res) => getWaisController.getResult(req, res)
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
