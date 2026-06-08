const express = require('express');
const { apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpPeerSessionRepository = require('../../../infrastructure/repositories/ImpPeerSessionRepository');

const PostPeerSessionUseCase = require('../../../application/usecase/peers/postPeerSessionUseCase');
const PostPeerSessionController = require('../../controller/peerSession/postPeerSession.controller');

const GetPeerStatsUseCase = require('../../../application/usecase/peers/getPeerStatsUseCase');
const GetPeerStatsController = require('../../controller/peerSession/getPeerStats.controller');

const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

const DeletePeerSessionUseCase = require('../../../application/usecase/peers/deletePeerSessionUseCase');
const DeletePeerSessionController = require('../../controller/peerSession/deletePeerSession.controller');
const GetPeerSessionsUseCase = require('../../../application/usecase/peers/getPeerSessionsUseCase');
const GetPeerSessionsController = require('../../controller/peerSession/getPeerSession.controller');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repository = new ImpPeerSessionRepository();
  
  const useCase = new PostPeerSessionUseCase(repository);
  const controller = new PostPeerSessionController(useCase);

  const statsUseCase = new GetPeerStatsUseCase(repository);
  const statsController = new GetPeerStatsController(statsUseCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const deleteUseCase = new DeletePeerSessionUseCase(repository);
  const deleteController = new DeletePeerSessionController(deleteUseCase);
  const listUseCase = new GetPeerSessionsUseCase(repository);
  const listController = new GetPeerSessionsController(listUseCase);

  router.get(
    '/',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getPeerSessionsView(req, res)
  );

  router.get(
    '/stats',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => statsController.getPeerStats(req, res)
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
  router.get(
    '/list',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => listController.getPeerSessions(req, res)
  );

  return router;
};
