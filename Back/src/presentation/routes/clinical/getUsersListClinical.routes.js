const express = require('express');
const router = express.Router();

const ClinicalRepository = require('../../../infrastructure/repositories/clinicalRepository');
const getClinicalListUseCase = require('../../../application/usecase/clinical/getClinicalListUseCase');
const getUsersClinicalListController = require('../../controller/clinical/getUsersListClinical.controller');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const repository = new ClinicalRepository();
  const useCase = new getClinicalListUseCase(repository);
  const controller = new getUsersClinicalListController(useCase);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/clinico',  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'), (req, res) => controller.getUsersPage(req, res));
  router.get('/api/usuarios-clinicos', authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getUsers(req, res));

  return router;
};
