const express = require("express");
const router = express.Router();    

const UsersController = require("../../controller/users/users.controller");
const UserRepository = require("../../../infrastructure/repositories/userRepository");
const ConsultUserUseCase = require("../../../application/usecase/consultUserUseCase");

const repository = new UserRepository();
const useCase = new ConsultUserUseCase(repository);
const controller = new UsersController(useCase);

router.get("/:id_user", (req, res) => controller.getUser(req, res));

module.exports = router;