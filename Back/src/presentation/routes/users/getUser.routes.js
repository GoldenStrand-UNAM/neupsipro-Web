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

//APOINTMENTS
const ImpAppointmentRepository = require('../../../infrastructure/repositories/ImpAppointmentRepository');

const createAppointmentUseCase = require('../../../application/usecase/appointments/createAppointmentUseCase');

const CreateAppointmentController = require('../../controller/appointments/createAppointment.controller');



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

  const createAppointmentUC = new createAppointmentUseCase(appointmentRepository);

  const appointmentController = new CreateAppointmentController(createAppointmentUC);

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

  return router;
};
