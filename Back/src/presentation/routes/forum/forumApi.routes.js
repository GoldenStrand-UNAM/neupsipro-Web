const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpForumRepository = require('../../../infrastructure/repositories/ImpForumRepository');
const GetForumUseCase = require('../../../application/usecase/forum/getForumUseCase');
const GetForumController = require('../../controller/forum/getForum.controller');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpForumRepository();
  const useCase = new GetForumUseCase(repository);
  const controller = new GetForumController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('Forum', 'consultation'),
    (req, res) => controller.getForum(req, res)
  );

  return router;
};