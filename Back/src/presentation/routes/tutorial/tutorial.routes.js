const express = require('express');
const ImpTutorialRepository = require('../../../infrastructure/repositories/ImpTutorialRepository');
const GetTutorialUseCase    = require('../../../application/usecase/tutorial/getTutorialUseCase');
const GetTutorialController = require('../../controller/tutorial/getTutorial.controller');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

module.exports = (authMiddleware) => {
  const router = express.Router();
  const repository = new ImpTutorialRepository();
  const useCase    = new GetTutorialUseCase(repository);
  const controller = new GetTutorialController(useCase);

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    (req, res) => controller.getTutorial(req, res)
  );

  return router;
};
