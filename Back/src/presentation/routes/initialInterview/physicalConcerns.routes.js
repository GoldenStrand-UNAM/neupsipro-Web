const express = require('express');
const { apiLimiter, userLimiter } = require('../../../infrastructure/external/rateLimiting');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const PhysicalConcernsRepository = require('');

// GET
const GetPhysicalConcernsController = require('../../controller/initialInterview/getPhysicalConcerns.controller');
const GetPhysicalConcernsUseCase = require('');
// POST

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new PhysicalConcernsRepository;
  const getUsecase = new GetPhysicalConcernsUseCase(repository);
  const getController = new GetPhysicalConcernsController(getUsecase);

  // Route to the view
  router.get(
    '',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => getController.getPhysicalConcernsView(req, res)
  );

  // Route to get the physical concerns previous answers
  router.get(
    '',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => getController.getPhysicalConcerns(req, res)
  );


  return router;
};
