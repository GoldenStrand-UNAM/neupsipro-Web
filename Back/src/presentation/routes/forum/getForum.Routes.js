const express = require("express");

const ForumRepository = require("../../../infrastructure/repositories/forumRepository");
const ForumController = require("../../controller/forum/GetForum.Controller");
const GetForumUseCase = require("../../../application/usecase/forum/getForumUseCase");
const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware");
const PermissionsMiddleware = require("../../../infrastructure/auth/permissions.middleware");

module.exports = (authUseCase) => {
    const router = express.Router();

    const repository = new ForumRepository();
    const useCase = new GetForumUseCase(repository);
    const controller = new ForumController(useCase);

    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);
    const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

    router.get(
        '/',
        authMiddleware.verifyToken,
        permissionsMiddleware.requirePermission('Forum', 'consultation'),
        (req, res) => controller.getForum(req, res)
    );

    return router;
};