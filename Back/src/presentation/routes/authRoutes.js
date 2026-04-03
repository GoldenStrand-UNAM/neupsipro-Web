const express = require("express");

module.exports = (authController) => {
    const router = express.Router();

    router.get("/", authController.getLogin);
    router.post("/login", (req, res) => authController.login(req,res));
    router.post("/logout", (req, res) => authController.logout(req, res));

    return router;
};