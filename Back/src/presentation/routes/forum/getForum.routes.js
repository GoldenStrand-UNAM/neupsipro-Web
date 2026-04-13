const express = require("express")
const router = express.Router()



const ForumRepository = require("../../../infrastructure/repositories/forumRepository");
const ForumController = require("../../controller/forum/GetForum.Controller");
const GetForumUseCase = require("../../../application/usecase/getForumUseCase");

const repository = new ForumRepository();
const useCase = new GetForumUseCase(repository);
const controller = new ForumController(useCase);

router.get('/Foro', (req, res) => controller.getForum(req, res));




module.exports = router