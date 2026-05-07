const express = require('express');

const ImpUserRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
const GetUsersListUseCase = require('../../../application/usecase/users/getUserListUseCase');
const getUsersListController = require('../../controller/users/getUsersList.controller');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {

  const router = express.Router();

  const repository = new ImpUserRepository();
  const useCase = new GetUsersListUseCase(repository);
  const controller = new getUsersListController(useCase);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/users',  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUsersPage(req, res));
  router.get('/api/users',  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUsers(req, res));

  return router;

};
