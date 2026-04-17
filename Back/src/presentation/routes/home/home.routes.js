const express = require("express");
 
const HomeController = require("../../controller/home/home.controller");

module.exports = (authMiddleware) => {
    const router = express.Router();
    
    const homeController = new HomeController();

    router.get('/home', authMiddleware.verifyToken, homeController.getHome);
    
    return router;
};