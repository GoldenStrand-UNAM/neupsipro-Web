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

const getReyResultUseCase       = require('../../../application/usecase/testApplications/getReyUseCase');
const getReyResultController    = require('../../controller/testApplications/getRey.controller');

//Nih
const postNihUseCase       = require('../../../application/usecase/testApplications/postNihUseCase');
const postNihController    = require('../../controller/testApplications/postNih.controller');

const getNihResultUseCase  = require('../../../application/usecase/testApplications/getNihUseCase');
const getNihResultController     = require('../../controller/testApplications/getNih.controller');

//Moca

const postMocaUseCase    = require('../../../application/usecase/testApplications/postMocaUseCase');
const postMocaController = require('../../controller/testApplications/postMoca.controller');

const getMocaResultUseCase        = require('../../../application/usecase/testApplications/getMocaUseCase');
const getMocaResultController     = require('../../controller/testApplications/getMoca.controller');

//Emotion

const postEmotionUseCase        = require('../../../application/usecase/testApplications/postEmotionUseCase');
const postEmotionController     = require('../../controller/testApplications/postEmotion.controller');
const getEmotionResultUseCase   = require('../../../application/usecase/testApplications/getEmotionResultUseCase');
const getEmotionResultController = require('../../controller/testApplications/getEmotion.controller');

//AUTH & PERMISSIONS
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

// Export PDF
const ImpUsersRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
const PdfService = require('../../../infrastructure/external/pdf.service');
const ExportPdfUseCase = require('../../../application/usecase/testApplications/exportPdfUseCase');
const ExportPdfController = require('../../controller/testApplications/exportPdf.controller');

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

  //REY
  const reyUseCase    = new postReyUseCase(testResultsRepo);
  const reyController = new postReyController(reyUseCase);

  const getReyUseCase    = new getReyResultUseCase(testResultsRepo);
  const getReyController = new getReyResultController(getReyUseCase);

  //Nih
  const nihUseCase    = new postNihUseCase(testResultsRepo);
  const nihController = new postNihController(nihUseCase);

  const getNihUseCase = new getNihResultUseCase(testResultsRepo);
  const getNihController    = new getNihResultController(getNihUseCase);
  //Moca
  const MocaUseCase    = new postMocaUseCase(testResultsRepo);
  const MocaController = new postMocaController(MocaUseCase);

  const getMocaUseCase    = new getMocaResultUseCase(testResultsRepo);
  const getMocaController = new getMocaResultController(getMocaUseCase);

  //Emotion
  const emotionUseCase    = new postEmotionUseCase(testResultsRepo);
  const emotionController = new postEmotionController(emotionUseCase);

  const getEmotionUseCase    = new getEmotionResultUseCase(testResultsRepo);
  const getEmotionController = new getEmotionResultController(getEmotionUseCase);

  // Export PDF
  const usersRepo = new ImpUsersRepository();
  const pdfService = new PdfService();
  const exportPdfUseCase = new ExportPdfUseCase(
    testResultsRepo,
    usersRepo,
    pdfService,
    getBanfeUseCase,
    getWaisUseCase,
    getReyUseCase,
    getMocaUseCase,
    getNihUseCase
  );
  const exportPdfController = new ExportPdfController(exportPdfUseCase);

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
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => reyController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/3/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getReyController.getResult(req, res)
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
    (req, res) => getNihController.getResult(req, res)
  );

  // ======================== Moca ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/4/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => MocaController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/4/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getMocaController.getResult(req, res)
  );

  // ======================== EMOTION ===============================
  router.post(
    '/api/users/:id_user/applications/:id_application/tests/6/results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => emotionController.postResult(req, res)
  );

  router.get(
    '/api/users/:id_user/applications/:id_application/tests/6/results/:id_results',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => getEmotionController.getResult(req, res)
  );

  // ======================== AUXILIARY ENDPOINTS FOR Moca & REY ===============================

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
          const parts = String(birthdate).split(/[-\/]/).map(Number);
          const birth = new Date(parts[0], parts[1] - 1, parts[2]);
          let years = today.getFullYear() - birth.getFullYear();
          const m = today.getMonth() - birth.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years -= 1;
          res.status(200).json({ age: years });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  );

  // ======================== EXPORT PDF ===============================
  router.get(
    '/users/:id_user/applications/:id_application/export',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Tests', 'consultation'),
    (req, res) => exportPdfController.export(req, res)
  );

  return router;

};
