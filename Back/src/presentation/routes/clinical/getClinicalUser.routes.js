const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const router = express.Router();

const ClinicalUserController = require('../../controller/clinical/getClinicalUser.controller');
const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const GetClinicalUserUseCase = require('../../../application/usecase/clinical/getClinicalUserUseCase');
const GetClinicalPatientsUseCase = require('../../../application/usecase/clinical/getClinicalPatientsUseCase');

module.exports = (authUseCase, authMiddleware) => {

  const clinicalUserRepository    = new ImpClinicalRepository();
  const useCase = new GetClinicalUserUseCase(clinicalUserRepository);
  const secondUseCase = new GetClinicalPatientsUseCase(clinicalUserRepository);
  const controller = new ClinicalUserController(useCase, secondUseCase);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/clinical-patient', authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getPatients(req, res));

  router.get(
    '/:id_user', authMiddleware.verifyToken,     apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getClinicalUser(req, res)
  );

  return router;
};
