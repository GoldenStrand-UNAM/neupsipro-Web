const express = require("express");


const authService = new AuthService();
const logoutUseCase = new LogoutUseCase(authService);
const authController = new AuthController(logoutUseCase);

module.exports = (authController) => {
    const router = express.Router();

    router.post("/logout", (req, res) => authController.logout(req, res));

    return router;
};