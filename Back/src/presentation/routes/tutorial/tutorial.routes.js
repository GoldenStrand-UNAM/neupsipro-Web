const express = require('express');
const ImpTutorialRepository = require('../../../infrastructure/repositories/ImpTutorialRepository');
const GetTutorialUseCase    = require('../../../application/usecase/tutorial/getTutorialUseCase');
const GetTutorialController = require('../../controller/tutorial/getTutorial.controller');
const JwtService     = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware  = require('../../../infrastructure/auth/auth.middleware');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

module.exports = () => {
  const router = express.Router();
  const repository = new ImpTutorialRepository();
  const useCase    = new GetTutorialUseCase(repository);
  const controller = new GetTutorialController(useCase);
  const authMiddleware = new AuthMiddleware(new JwtService());

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    (req, res) => controller.getTutorial(req, res)
  );

  return router;
};
