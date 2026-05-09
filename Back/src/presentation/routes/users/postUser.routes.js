const express = require("express");

const ImpUserRepository = require("../../../infrastructure/repositories/ImpUsersRepository");
const PostUserUseCase = require("../../../application/usecase/users/postUserUseCase");
const postUserController = require("../../controller/users/postUser.controller");
const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware");
const PermissionsMiddleware = require("../../../infrastructure/auth/permissions.middleware");

module.exports = (authUseCase) => {

    const router = express.Router();

    const repository = new ImpUserRepository();
    const useCase = new PostUserUseCase(repository, );
    const controller = new postUserController(useCase);

    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);
    const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

    router.get("/user/post",  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('user management', 'writing'), (req, res) => controller.postUserPage(req, res));
    router.post("/user/post",  authMiddleware.verifyToken, permissionsMiddleware.requirePermission('user management', 'writing'), (req, res) => controller.postUser(req, res));

    return router;
}