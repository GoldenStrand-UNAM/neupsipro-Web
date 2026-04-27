const express = require('express');
const ForumRepository = require('../../../infrastructure/repositories/forumRepository');
const PostPublicationController = require('../../controller/forum/postPublication.Controller');
const RegPublicationUseCase = require('../../../application/usecase/forum/postPublicationUseCase');
const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');

const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware');
const PermissionsMiddleware = require('../../../infrastructure/auth/permissions.middleware');

module.exports = (authUseCase) => {
    const router = express.Router();

    const repository = new ForumRepository();
    const useCase = new RegPublicationUseCase(repository);
    const controller = new PostPublicationController(useCase);

    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);
    const permissionsMiddleware = new PermissionsMiddleware(authUseCase);

    router.get(
        '/forum/registrar',
        //authMiddleware.verifyToken,
       // permissionsMiddleware.requirePermission('Forum', 'writing'),
        (req, res) => res.render('forum/postPublication', { activePage: 'foro' })
    );

    router.post(
        '/forum/registrar',
        //authMiddleware.verifyToken,                                     
        //permissionsMiddleware.requirePermission('Forum', 'writing'),
        upload.single('imagen'),
        validateImageMiddleware,
        s3UploadMiddleware,
        (req, res) => controller.registerPublication(req, res)
    );

    return router; 
};