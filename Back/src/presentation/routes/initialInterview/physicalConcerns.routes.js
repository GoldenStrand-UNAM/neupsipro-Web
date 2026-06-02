const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const PhysicalConcernsRepository = require('../../../infrastructure/repositories/ImpPhysicalConcernsRepository');

// GET
const GetPhysicalConcernsController = require('../../controller/initialInterview/getPhysicalConcerns.controller');
const GetPhysicalConcernsUseCase = require('../../../application/usecase/initialInterview/getPhysicalUseCase');
// POST

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new PhysicalConcernsRepository;
  const getUsecase = new GetPhysicalConcernsUseCase(repository);
  const getController = new GetPhysicalConcernsController(getUsecase);

  // Route to the view
  router.get(
    '/view',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => getController.getPhysicalConcernsView(req, res)
  );

  // Route to get the physical concerns previous answers
  router.get(
    '/:idUserRelation',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => getController.getPhysicalConcerns(req, res)
  );

  return router;
};
