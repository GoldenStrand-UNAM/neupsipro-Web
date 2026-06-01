const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpUserRepository = require('../../../infrastructure/repositories/ImpUsersRepository');
const GetUsersListUseCase = require('../../../application/usecase/users/getUserListUseCase');
const getUsersListController = require('../../controller/users/getUsersList.controller');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {

  const router = express.Router();

  const repository = new ImpUserRepository();
  const useCase = new GetUsersListUseCase(repository);
  const controller = new getUsersListController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get('/users',  authMiddleware.verifyToken, apiLimiter, permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUsersPage(req, res));
  router.get('/api/users',  authMiddleware.verifyToken, apiLimiter, permissionsMiddleware.requirePermission('user management', 'consultation'), (req, res) => controller.getUsers(req, res));

  return router;
};
