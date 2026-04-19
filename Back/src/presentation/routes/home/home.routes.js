const express = require("express");
 
const HomeController = require("../../controller/home/home.controller");
const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware"); 
const PermissionsMiddleware = require("../../../infrastructure/auth/permissions.middleware");

module.exports = (authUseCase) => {
    const router = express.Router();

    const jwtService = new JwtService();
    const authMiddleware = new AuthMiddleware(jwtService);

    
    const permissionsMiddleware = new PermissionsMiddleware(authUseCase);
    
    const homeController = new HomeController();

    router.get(
        '/home', 
        authMiddleware.verifyToken, 
        permissionsMiddleware.requirePermission('gaming', 'consultation'), //send necessary permissions to verify access
        homeController.getHome
    );
    
    return router;
};