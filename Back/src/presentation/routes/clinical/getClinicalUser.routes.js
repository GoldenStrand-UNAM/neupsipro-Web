const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const router = express.Router();

const ClinicalUserController = require('../../controller/clinical/getClinicalUser.controller');
const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const GetClinicalUserUseCase = require('../../../application/usecase/clinical/getClinicalUserUseCase');
const GetClinicalPatientsUseCase = require('../../../application/usecase/clinical/getClinicalPatientsUseCase');

const deleteClinicalUseCase = require('../../../application/usecase/clinical/deleteClinicalUseCase');
const DeleteClinicalController = require('../../controller/clinical/deleteClinical.controller');

module.exports = (authUseCase, authMiddleware) => {

  const clinicalUserRepository    = new ImpClinicalRepository();
  const useCase = new GetClinicalUserUseCase(clinicalUserRepository);
  const secondUseCase = new GetClinicalPatientsUseCase(clinicalUserRepository);
  const controller = new ClinicalUserController(useCase, secondUseCase);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const deleteUseCase = new deleteClinicalUseCase(clinicalUserRepository);
  const deleteController = new DeleteClinicalController(deleteUseCase);

  router.get('/clinical-patient', authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getPatients(req, res));

  router.get(
    '/:id_user', authMiddleware.verifyToken,     apiLimiter,
    permissionsMiddleware.requirePermission('clinical', 'consultation'), (req, res) => controller.getClinicalUser(req, res)
  );

  router.delete(
    '/:id_user',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('clinical', 'eliminate'),
    (req, res) => deleteController.deleteClinical(req, res)
  );

  return router;
};
