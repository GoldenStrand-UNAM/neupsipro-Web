const express = require('express');

const ImpInterventionRepository = require('../../../infrastructure/repositories/ImpInterventionRepository');
const getInterventionUseCase = require('../../../application/usecase/interventions/getInterventionUseCase');
const updateContractUseCase = require('../../../application/usecase/interventions/updateContractUseCase');
const addSessionUseCase = require('../../../application/usecase/interventions/addSessionUseCase');
const deleteSessionUseCase = require('../../../application/usecase/interventions/deleteSessionUseCase');
const InterventionController = require('../../controller/interventions/intervention.controller');
const updateSessionUseCase = require('../../../application/usecase/interventions/updateSessionUseCase');


const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');


const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

module.exports = (authUseCase, authMiddleware) => {
  const router = express.Router();

  const repo = new ImpInterventionRepository();
  const intervention = new getInterventionUseCase(repo);
  const updateNeuroContract = new updateContractUseCase(repo);
  const Session = new addSessionUseCase(repo);
  const DeleteSession = new deleteSessionUseCase(repo);
  const UpdateSession = new updateSessionUseCase(repo);
  const controller = new InterventionController(intervention, updateNeuroContract, Session, DeleteSession, UpdateSession);

  
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/users/:id_user/intervention',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getPage(req, res)
  );

  router.patch(
    '/users/:id_user/intervention',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'edit'),
    (req, res) => controller.updateContract(req, res)
  );

  router.post(
    '/users/:id_user/intervention/sessions',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => controller.addSession(req, res)
  );

  router.delete(
    '/users/:id_user/intervention/sessions/:id_session',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'eliminate'),
    (req, res) => controller.deleteSession(req, res)
  );

  router.patch(
    '/users/:id_user/intervention/sessions/:id_session',
    authMiddleware.verifyToken, apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'edit'),
    (req, res) => controller.updateSession(req, res)
  );

  return router;
};
