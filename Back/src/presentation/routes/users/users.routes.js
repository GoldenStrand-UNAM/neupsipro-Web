const express = require("express");
const router = express.Router();    

const usersController = require("../../controller/users.controllers");

router.get("/logbook/{user_id}", (req, res) => usersController.getLogbook(req, res));

module.exports = router;