const express = require('express');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const GetMenuClinicalUsersController = require('../../controller/dashboard/getMenuClinicalUsers.controller');
const GetClinicalUserDashboardController = require('../../controller/dashboard/getClinicalUserDashboard.controller');
const GetUserInfoController = require('../../controller/dashboard/getUserInfo.controller');
const GetMenuClinicalUsersUseCase = require('../../../application/usecase/clinical/getMenuClinicalUsersUseCase');
const GetClinicalUserDashboardUseCase = require('../../../application/usecase/dahsboard/getClinicalUserDashboardUseCase');
const GetUserInfoUseCase = require('../../../application/usecase/dahsboard/getUserInfoUseCase');
const ClinicalDashboardRepository = require('../../../infrastructure/repositories/ImpClinicalDashboardRepository');
const AppointmentRepository = require('../../../infrastructure/repositories/ImpAppointmentRepository');
const ClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');

module.exports = (authUseCase) => {
  const router = express.Router();
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
  const clinicalDashboardRepository = new ClinicalDashboardRepository();
  const appointmentRepository = new AppointmentRepository();
  const clinicalRepository = new ClinicalRepository();
  const useCase1 = new GetMenuClinicalUsersUseCase(clinicalRepository);
  const useCase2 = new GetClinicalUserDashboardUseCase(clinicalDashboardRepository, appointmentRepository);
  const useCase3 = new GetUserInfoUseCase(clinicalDashboardRepository);
  const controller1 = new GetMenuClinicalUsersController(useCase1);
  const controller2 = new GetClinicalUserDashboardController(useCase2);
  const controller3 = new GetUserInfoController(useCase3);

  router.get(
    '/',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Forum', 'consultation'), //QUE PERMISOS USA?
    (req, res) => controller1.getMenuClinicalUsers(req, res)

  );

  router.get(
    '/:idClinicalUser',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Forum', 'consultation'), //QUE PERMISOS USA?
    (req, res) => controller2.getClinicalDashboard(req, res)
  );

  router.get(
    '/user/:idUser',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('Forum', 'consultation'), //QUE PERMISOS USA?
    (req, res) => controller3.getClinicalDashboard(req, res)
  );

  return router;
};
