const express = require('express');
const ImpProfileRepository = require('../../../infrastructure/repositories/ImpProfileRepository');
const GetProfileUseCase = require('../../../application/usecase/users/getProfileUseCase');
const ProfileController = require('../../controller/users/profile.controller');
const JwtService = require('../../../infrastructure/external/jwt.service');
const AuthMiddleware = require('../../../infrastructure/auth/auth.middleware')
const db = require('../../../infrastructure/database/database');

module.exports = (_authUseCase) => {
    const router = express.Router();
    const impProfileRepository = new ImpProfileRepository(db);
    const getProfileUseCase = new GetProfileUseCase(impProfileRepository);
    const profileController = new ProfileController(getProfileUseCase);
    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);

router.get(
    '/:userId',
    authMiddleware.verifyToken,
    (req, res) => profileController.getProfile(req, res)
);

return router;
};
