const express = require('express');

const router = express.Router();

const UserController = require('../../controller/users/getUser.controller');
const UsersRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const impTestApplicationsRepository = require('../../../infrastructure/repositories/impTestApplicationRepository');
const impTestResultsRepository      = require('../../../infrastructure/repositories/impTestResultsRepository');

const GetUserUseCase = require('../../../application/usecase/users/getUserUseCase');

const postApplicationUseCase   = require('../../../application/usecase/testApplications/postApplicationUseCase');
const ApplicationsController   = require('../../controller/testApplications/postApplications.controller');

//APOINTMENTS create
const ImpAppointmentRepository = require('../../../infrastructure/repositories/ImpAppointmentRepository');
const createAppointmentUseCase = require('../../../application/usecase/appointments/createAppointmentUseCase');
const createAppointmentController = require('../../controller/appointments/createAppointment.controller');

//apointment delete
const deleteAppointmentUseCase    = require('../../../application/usecase/appointments/deleteAppointmentUseCase');
const deleteAppointmentController = require('../../controller/appointments/deleteAppointment.controller');

module.exports = (authUseCase) => {

  const usersRepository    = new UsersRepository();
  const testAppRepository  = new impTestApplicationsRepository();
  const useCase            = new GetUserUseCase(usersRepository, testAppRepository);
  const controller = new UserController(useCase);
  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const testResultsRepository  = new impTestResultsRepository();
  const createAppUseCase       = new postApplicationUseCase(testAppRepository, testResultsRepository);
  const appController = new ApplicationsController(createAppUseCase);

  const appointmentRepository = new ImpAppointmentRepository();
  const createAppointment = new createAppointmentUseCase(appointmentRepository);
  const appointmentController = new createAppointmentController(createAppointment);

  const deleteAppointment   = new deleteAppointmentUseCase(appointmentRepository);
  const deleteAppointmentCtrl = new deleteAppointmentController(deleteAppointment);

  router.get(
    '/:id_user', authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUser(req, res)
  );

  router.get('/consultUser', (req, res) => {
    res.render('users/consultUser', {
      activePage: 'usuario',

    });
  });

  //Create Application route

  router.post('/:id_user/applications', (req, res) => appController.createApplication(req, res));

    router.get(
    '/clinics/list',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => clinicsController.listClinics(req, res)
  );

  router.post(
    '/:id_user/appointments',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => appointmentController.createAppointment(req, res)
  );

  router.delete(
  '/:id_user/appointments',
  authMiddleware.verifyToken,
  permissionsMiddleware.requirePermission('user management', 'eliminate'),
  (req, res) => deleteAppointmentCtrl.deleteAppointment(req, res)
  );
  return router;
};
