const express = require('express');
const {  apiLimiter } = require('../../../infrastructure/external/rateLimiting');

const ImpClinicalRepository = require('../../../infrastructure/repositories/ImpClinicalRepository');
const PostClinicalUserUseCase = require('../../../application/usecase/clinical/postClinicalUserUseCase');
const postClinicalUserController = require('../../controller/clinical/postClinicalUser.controller');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');
const HashingService = require('../../../infrastructure/external/hashing.service');
const upload = require('../../../infrastructure/external/multer.service');

const EditClinicalUserUseCase = require('../../../application/usecase/clinical/editClinicalUserUseCase');
const editClinicalUserController = require('../../controller/clinical/editClinicalUser.controller');

module.exports = (authUseCase, authMiddleware) => {

  const router = express.Router();

  const repository = new ImpClinicalRepository();
  const hashingService = new HashingService();
  const useCase = new PostClinicalUserUseCase(repository, hashingService);
  const controller = new postClinicalUserController(useCase);

  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  const editUseCase = new EditClinicalUserUseCase(repository, hashingService);
  const editController = new editClinicalUserController(editUseCase, repository);

  router.get(
    '/postUser',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => controller.postUser(req, res)
  );

  router.post(
    '/post',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    upload.none(),
    (req, res) => controller.postClinicalUser(req, res)
  );

  router.get(
    '/:id_user/edit',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'consultation'),
    (req, res) => editController.editClinicalUserView(req, res)
  );

  router.post(
    '/:id_user/edit',
    authMiddleware.verifyToken,
    apiLimiter,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    upload.none(),
    (req, res) => editController.editClinicalUser(req, res)
  );

  return router;
};
