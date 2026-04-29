const express = require("express")

const PublicationController = require("../../controller/forum/getPublication.Controller");
const GetPublicationUseCase =  require("../../../application/usecase/forum/getPublicationUseCase");
const InteractionRepository = require("../../../infrastructure/repositories/interactionRepository");
const PublicationRepository = require("../../../infrastructure/repositories/forumRepository");
const UsersRepository = require("../../../infrastructure/repositories/usersRepository");
const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware");
const PermissionsMiddleware = require("../../../infrastructure/auth/permissions.middleware");

module.exports = (authUseCase) => {
    const router = express.Router();

    // Calls all of the repositories, implementations, usecases and controllers
    const repository = new PublicationRepository();
    const intRepository = new InteractionRepository();
    const userRepository = new UsersRepository();
    const useCasePublication = new GetPublicationUseCase(repository, intRepository, userRepository);
    const controller = new PublicationController(useCasePublication);
    
    // Required for auth
    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);
    const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

    // Route to get a publication by its id.
    router.get (
        "/:idPublication",
        authMiddleware.verifyToken,
        permissionsMiddleware.requirePermission('Forum', 'consultation'),
        (req, res) => controller.getPublication(req, res)
    );

    return router;
}

