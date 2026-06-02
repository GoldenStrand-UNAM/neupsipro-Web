const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpPeerSessionRepository = require('../../../infrastructure/repositories/ImpPeerSessionRepository');
const PostPeerSessionUseCase = require('../../../application/usecase/peers/postPeerSessionUseCase');
const PostPeerSessionController = require('../../controller/peerSession/postPeerSession.controller');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpPeerSessionRepository();
  const useCase = new PostPeerSessionUseCase(repository);
  const controller = new PostPeerSessionController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getPeerSessionsView(req, res)
  );

  router.post(
    '/post',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => controller.postPeerSession(req, res)
  );

  return router;
};