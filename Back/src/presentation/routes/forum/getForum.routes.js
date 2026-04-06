const express = require("express")
const router = express.Router()
const ForumController = require("../../controller/forum/GetForum.Controller")


router.get("/foro", ForumController.GetForum)

module.exports = router