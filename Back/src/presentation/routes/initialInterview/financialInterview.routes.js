const express = require('express');

const FIController = require('../../controller/inicialInterview/financialInterview.controller');
const FIRepository = require('../../../infrastructure/repositories/financialInterviewRepository');
const GetFIUseCase = require('../../../application/usecase/inicialInterview/financialInterviewUseCase');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router({ mergeParams: true });

  const repository = new FIRepository();
  const useCase = new GetFIUseCase(repository);
  const controller = new FIController(useCase);
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/financial',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('clinical', 'consultation'),
    (req, res) => controller.getFinancialPage(req, res)
  );

  router.get(
    '/api/financial/:id_user',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getFinancialInterview(req, res)
  );

  return router;
};
