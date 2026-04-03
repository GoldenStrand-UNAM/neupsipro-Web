const express = require("express");

module.exports = (authController) => {
    const router = express.Router();

    router.post("/logout", (req, res) => authController.logout(req, res));

    return router;
};