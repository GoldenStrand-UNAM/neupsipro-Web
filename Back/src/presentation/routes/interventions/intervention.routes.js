const express = require('express');

const ImpInterventionRepository = require('../../../infrastructure/repositories/ImpInterventionRepository');
const getInterventionUseCase = require('../../../application/usecase/interventions/getInterventionUseCase');
const updateContractUseCase = require('../../../application/usecase/interventions/updateContractUseCase');
const addSessionUseCase = require('../../../application/usecase/interventions/addSessionUseCase');
const deleteLastSessionUseCase = require('../../../application/usecase/interventions/deleteLastSessionUseCase');
const InterventionController = require('../../controller/interventions/intervention.controller');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
  const router = express.Router();

  const repo = new ImpInterventionRepository();
  const intervention = new getInterventionUseCase(repo);
  const updateNeuroContract = new updateContractUseCase(repo);
  const Session = new addSessionUseCase(repo);
  const DeleteLastSession = new deleteLastSessionUseCase(repo);
  const controller = new InterventionController(intervention, updateNeuroContract, Session, DeleteLastSession);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    '/users/:id_user/intervention',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.getPage(req, res)
  );

  router.patch(
    '/users/:id_user/intervention',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'edit'),
    (req, res) => controller.updateContract(req, res)
  );

  
  router.post(
    '/users/:id_user/intervention/sessions',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => controller.addSession(req, res)
  );

  router.delete(
    '/users/:id_user/intervention/sessions/:id_session',
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'eliminate'),
    (req, res) => controller.deleteLastSession(req, res)
  );

  return router;
};