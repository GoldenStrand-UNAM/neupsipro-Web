const express = require('express');

// Base imports
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const FIRepository = require('../../../infrastructure/repositories/financialInterviewRepository');

// Get
const FIController = require('../../controller/inicialInterview/financialInterview.controller');
const GetFIUseCase = require('../../../application/usecase/inicialInterview/financialInterviewUseCase');

// Post
const PFIController = require('../../controller/inicialInterview/postFinancialInterview.controller');
const PostFIUseCase = require('../../../application/usecase/inicialInterview/postFinancialInterviewUseCase');

module.exports = (authUseCase) => {
  const router = express.Router({ mergeParams: true });

  // Bse
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const repository = new FIRepository();

  // GET
  const useCase = new GetFIUseCase(repository);
  const controller = new FIController(useCase);

  router.get(
    '/financial',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('clinical', 'consultation'),
    (req, res) => controller.getFinancialPage(req, res)
  );

  router.get(
    '/api/:id_user/:step/:subStep',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Initial interview', 'consultation'),
    (req, res) => controller.getFinancialInterview(req, res)
  );

  // POST
  const postUseCase = new PostFIUseCase(repository);
  const postController = new PFIController(postUseCase);

  router.patch(
    '/api/:id_user/:step/:subStep',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Initial interview', 'edit'),
    (req, res) => postController.saveFinancialInterview(req, res)
  );

  return router;

};
