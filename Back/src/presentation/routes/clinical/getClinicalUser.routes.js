const express = require('express');

const router = express.Router();

const ClinicalUserController = require('../../controller/clinical/getClinicalUser.controller');
const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const GetClinicalUserUseCase = require('../../../application/usecase/clinical/getClinicalUserUseCase');
const GetClinicalPatientsUseCase = require('../../../application/usecase/clinical/getClinicalPatientsUseCase');

module.exports = (authUseCase) => {

  const clinicalUserRepository    = new ImpClinicalRepository();
  const useCase = new GetClinicalUserUseCase(clinicalUserRepository);
  const secondUseCase = new GetClinicalPatientsUseCase(clinicalUserRepository);
  const controller = new ClinicalUserController(useCase, secondUseCase);
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/clinical-patient', authMiddleware.verifyToken, permissionsMiddleware.requirePermission('clinical', 'consultation'),  (req, res) => controller.getPatients(req, res));

  router.get(
    '/:id_user', authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getClinicalUser(req, res)
  );

  return router;
};
