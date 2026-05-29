const express = require('express');
const { apiLimiter , userLimiter } = require('../../../infrastructure/external/rateLimiting');

const router = express.Router();

const UserController = require('../../controller/users/getUser.controller');
const UsersRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
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
const DeleteUserUseCase    = require('../../../application/usecase/users/deleteUserUseCase');
const DeleteUserController = require('../../controller/users/deleteUser.controller');

const checkExpiryUseCase    = require('../../../application/usecase/testApplications/checkExpiryUseCase');
const checkExpiryController = require('../../controller/testApplications/checkExpiry.controller');
const ClinicsController = require('../../controller/clinical/getListClinics.controller');
const ListClinicsUseCase = require('../../../application/usecase/clinical/listClinicsUseCase');
const ImpClinicRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');

const modifyProtocolUseCase   = require('../../../application/usecase/users/modifyProtocolUseCase');
const modifyProtocolController = require('../../controller/users/modifyProtocol.controller');
const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');
const HashingService  = require('../../../infrastructure/external/hashing.service');
 
const loadEditUserUseCase = require('../../../application/usecase/users/loadEditUserUseCase');
const editUserUseCase = require('../../../application/usecase/users/editUserUseCase');
const editUserController = require('../../controller/users/editUser.controller');
const loadEditUserController = require('../../controller/users/loadEditUser.controller');


module.exports = (authUseCase, authMiddleware) => {

  const usersRepository    = new UsersRepository();
  const testAppRepository  = new impTestApplicationsRepository();
  const appointmentRepository = new ImpAppointmentRepository();
  const useCase            = new GetUserUseCase(usersRepository, testAppRepository, appointmentRepository);
  const controller = new UserController(useCase);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const testResultsRepository  = new impTestResultsRepository();
  const createAppUseCase       = new postApplicationUseCase(testAppRepository, testResultsRepository);
  const appController = new ApplicationsController(createAppUseCase);

  const createAppointment = new createAppointmentUseCase(appointmentRepository);
  const appointmentController = new createAppointmentController(createAppointment);

  const deleteAppointment   = new deleteAppointmentUseCase(appointmentRepository);
  const deleteAppointmentCtrl = new deleteAppointmentController(deleteAppointment);
  const deleteUseCase    = new DeleteUserUseCase(usersRepository);
  const deleteController = new DeleteUserController(deleteUseCase);

  const expiryUseCase    = new checkExpiryUseCase(testAppRepository, testResultsRepository);
  const expiryController = new checkExpiryController(expiryUseCase);

  // Check and update expiry status for all active applications of a user.
  const clinicRepository = new ImpClinicRepository();
  const listClinicsUseCase = new ListClinicsUseCase(clinicRepository);
  const clinicsController = new ClinicsController(listClinicsUseCase);

  const protocolUseCase = new modifyProtocolUseCase(usersRepository);
  const protocolController = new modifyProtocolController(protocolUseCase);
  const hashingService  = new HashingService();
  const loadEditUser = new loadEditUserUseCase(usersRepository);
  const editUseCase = new editUserUseCase(usersRepository, hashingService);
  const loadEditController = new loadEditUserController(loadEditUser);
  const editController = new editUserController(editUseCase);

  router.get(
    '/:id_user/applications/check-expiry',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => expiryController.checkExpiry(req, res)
  );

  router.get('/consultUser', (req, res) => {
    res.render('users/consultUser', {
      activePage: 'usuario',

    });
  });

  router.get(
    '/:id_user', authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUser(req, res)
  );

  //Create Application route

  router.post('/:id_user/applications', (req, res) => appController.createApplication(req, res));

  router.get(
    '/clinics/list',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => clinicsController.listClinics(req, res)
  );

  router.post(
    '/:id_user/appointments',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => appointmentController.createAppointment(req, res)
  );

  router.delete(
    '/:id_user/appointments',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'eliminate'),
    (req, res) => deleteAppointmentCtrl.deleteAppointment(req, res)
  );
  router.delete(
    '/:id_user',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'eliminate'),
    (req, res) => deleteController.deleteUser(req, res)
  );
  
  router.get(
    '/:id_user/edit',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => loadEditController.renderEditUser(req, res)
  );
 
  router.post(
    '/:id_user/edit',
    authMiddleware.verifyToken,
    userLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    upload.single('profilePhoto'),
    validateImageMiddleware,
    s3UploadMiddleware,
    (req, res) => editController.editUser(req, res)
  );

  router.patch(
    '/:id_user/protocol',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => protocolController.modifyProtocol(req, res)
  );


  return router;
};
