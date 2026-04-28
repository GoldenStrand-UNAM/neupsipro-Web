const express = require("express")
const router = express.Router()

const PublicationController = require("../../controller/forum/getPublication.Controller");
const GetPublicationUseCase =  require("../../../application/usecase/forum/getPublicationUseCase");
const InteractionRepository = require("../../../infrastructure/repositories/interactionRepository");
const PublicationRepository = require("../../../infrastructure/repositories/forumRepository");
const UsersRepository = require("../../../infrastructure/repositories/usersRepository");

const repository = new PublicationRepository();
const intRepository = new InteractionRepository();
const userRepository = new UsersRepository();
const useCasePublication = new GetPublicationUseCase(repository, intRepository, userRepository);
const controller = new PublicationController(useCasePublication);


router.get("/:idPublication", (req, res) => controller.getPublication(req, res));


module.exports = router