const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpPeerSessionRepository = require('../../../infrastructure/repositories/ImpPeerSessionRepository');
const PostPeerSessionUseCase = require('../../../application/usecase/peers/postPeerSessionUseCase');
const PostPeerSessionController = require('../../controller/peerSession/postPeerSession.controller');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const DeletePeerSessionUseCase = require('../../../application/usecase/peers/deletePeerSessionUseCase');
const DeletePeerSessionController = require('../../controller/peerSession/deletePeerSession.controller');


module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpPeerSessionRepository();
  const useCase = new PostPeerSessionUseCase(repository);
  const controller = new PostPeerSessionController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const deleteUseCase = new DeletePeerSessionUseCase(repository);
  const deleteController = new DeletePeerSessionController(deleteUseCase);


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

  router.delete(
    '/:id_peer_session',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'eliminate'),
    (req, res) => deleteController.deletePeerSession(req, res)
  );

  return router;
};