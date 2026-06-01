const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const listClinicsUseCase = require('../../../application/usecase/clinical/listClinicsUseCase');
const ListClinicsController = require('../../controller/clinical/getListClinics.controller');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const clinicalRepository = new ImpClinicalRepository();
  const useCase = new listClinicsUseCase(clinicalRepository);
  const controller = new ListClinicsController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/api/clinics/list',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('clinical', 'consultation'),
    (req, res) => controller.listClinics(req, res)
  );

  return router;
};
