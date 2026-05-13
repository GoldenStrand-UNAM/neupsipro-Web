const express = require('express');

const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const getClinicalListUseCase = require('../../../application/usecase/clinical/getClinicalListUseCase');
const getUsersClinicalListController = require('../../controller/clinical/getUsersListClinical.controller');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const repository = new ImpClinicalRepository();
  const useCase = new getClinicalListUseCase(repository);
  const controller = new getUsersClinicalListController(useCase);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/clinico',  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'), (req, res) => controller.getUsersPage(req, res));
  router.get('/api/usuarios-clinicos', authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getUsers(req, res));

  return router;
};
