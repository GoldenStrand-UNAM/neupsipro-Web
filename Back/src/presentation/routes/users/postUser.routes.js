const express = require("express");

const ImpUserRepository = require("../../../infrastructure/repositories/ImpUsersRepository");
const PostUserUseCase = require("../../../application/usecase/users/postUserUseCase");
const postUserController = require("../../controller/users/postUser.controller");
const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware");
const PermissionsMiddleware = require("../../../infrastructure/auth/permissions.middleware");
const HashingService = require("../../../infrastructure/external/hashing.service");

const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');

module.exports = (authUseCase) => {

  const router = express.Router();

  const repository = new ImpUserRepository();
  const hashingService = new HashingService();
  const useCase = new PostUserUseCase(repository, hashingService);
  const controller = new postUserController(useCase);

  const jwtService = new JwtService();
  const authMiddleware = new AuthMiddleware(jwtService);
  const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

  router.get(
    "/user/post", 
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    (req, res) => res.render('users/postUser', { activePage: 'users' })
  );
  
  router.post(
    "/user/post",
    authMiddleware.verifyToken,
    permissionsMiddleware.requirePermission('user management', 'writing'),
    upload.single('profilePhoto'),
    validateImageMiddleware,
    s3UploadMiddleware,
    (req, res) => controller.postUser(req, res)
  );

  return router;
}