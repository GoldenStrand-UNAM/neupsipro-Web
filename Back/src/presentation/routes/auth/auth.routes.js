const express = require("express");
const { loginLimiter } = require("../../../infrastructure/external/rateLimiting");

module.exports = (loginController) => {
    const router = express.Router();

    router.get("/", (req, res) => loginController.getLogin(req, res));
    router.post("/login", loginLimiter, (req, res) => loginController.postLogin(req, res));

    return router;
};