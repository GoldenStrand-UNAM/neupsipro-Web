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

  return router;
};
