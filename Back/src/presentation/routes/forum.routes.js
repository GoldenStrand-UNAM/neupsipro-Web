const express = require("express");
const forumController = require("../controller/forum.controller")

module.exports = () => {
    const router = express.Router();
    router.get("/:idPublication", forumController.consultPublication);
    router.get("/", forumController.consultPublications);
    return router;
};