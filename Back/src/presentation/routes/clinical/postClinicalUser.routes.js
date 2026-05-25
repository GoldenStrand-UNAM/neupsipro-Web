const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const postClinicalUserController = require('../../controller/clinical/postClinicalUser.controller');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const HashingService = require('../../../infrastructure/external/hashing.service');

module.exports = (authUseCase) => {

  const router = express.Router();

  const repository = new ImpClinicalRepository();
  const hashingService = new HashingService();
  const controller = new postClinicalUserController();
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/postUser',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.postUser(req, res)
  );

  return router;
};