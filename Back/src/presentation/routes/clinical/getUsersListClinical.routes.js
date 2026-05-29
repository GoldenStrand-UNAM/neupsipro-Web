const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const getClinicalListUseCase = require('../../../application/usecase/clinical/getClinicalListUseCase');
const getUsersClinicalListController = require('../../controller/clinical/getUsersListClinical.controller');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpClinicalRepository();
  const useCase = new getClinicalListUseCase(repository);
  const controller = new getUsersClinicalListController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/clinical',  authMiddleware.verifyToken, apiLimiter, permissionsMiddleware.requirePermission('clinical', 'consultation'), (req, res) => controller.getUsersPage(req, res));
  router.get('/api/usuarios-clinicos', authMiddleware.verifyToken,  apiLimiter, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getUsers(req, res));

  return router;
};
