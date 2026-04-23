const express = require("express");
const { loginLimiter } = require("../../../infrastructure/external/rateLimiting");

module.exports = (logoutController, loginController) => {
    const router = express.Router();

    router.get("/", loginLimiter, (req, res) => loginController.getLogin(req, res));
    router.post("/login", loginLimiter, (req, res) => loginController.postLogin(req, res));
    router.post("/logout", (req, res) => logoutController.logout(req, res));

    return router;
};