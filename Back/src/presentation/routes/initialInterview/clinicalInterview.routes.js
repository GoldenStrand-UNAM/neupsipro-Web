const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const CIRepository = require('../../../infrastructure/repositories/ImpClinicalInterviewRepository');

// Get
const CIController = require('../../controller/initialInterview/clinicalInterview.controller');
const GetCIUseCase = require('../../../application/usecase/initialInterview/clinicalInterventionUseCase');

// Post
const PCIController = require('../../controller/initialInterview/postClinicalInterview.controller');
const PostCIUseCase = require('../../../application/usecase/initialInterview/postClinicalInterviewUseCase');


module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router({ mergeParams: true });
 
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
 
  const repository = new CIRepository();

  const onlyClinicalStep = (req, res, next) => {
    if (req.params.step === 'symptoms') return next();
    return next('route');
  };
 
  const useCase = new GetCIUseCase(repository);
  const controller = new CIController(useCase);

  const postUseCase = new PostCIUseCase(repository);
  const postController = new PCIController(postUseCase); 
 
  router.get(
    '/symptoms',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getClinicalPage(req, res)
  );
 
  router.get(
    '/symptoms/api/:id_user/:subStep',
    onlyClinicalStep,
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => {
      req.params.step = 'symptoms';
      controller.getClinicalInterview(req, res);
    }
  );

  router.patch(
    '/symptoms/api/:id_user/:subStep',
    onlyClinicalStep,
    authMiddleware.verifyToken,
    userLimiter,
    permissionsMiddleware.requirePermission('Initial interview', 'edit'),
    (req, res) => {
      req.params.step = 'symptoms';
      postController.saveClinicalInterview(req, res);
    }
  );
 
  return router;
};