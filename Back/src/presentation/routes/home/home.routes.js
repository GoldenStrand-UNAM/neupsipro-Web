const express = require("express");

const JwtService = require("../../../infrastructure/external/jwt.service");
const AuthMiddleware = require("../../../infrastructure/auth/auth.middleware"); 
const HomeController = require("../../controller/home/home.controller");

module.exports = () => {
    const router = express.Router();

    const jwtService = new JwtService();
    
    const authMiddleware = new AuthMiddleware(jwtService);
    
    const homeController = new HomeController();

    router.get('/home', authMiddleware.verifyToken, homeController.getHome);
    
    return router;
};