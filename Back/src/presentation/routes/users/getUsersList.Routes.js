const express = require("express");
const router = express.Router();
const UserRepository = require("../../../infrastructure/repositories/usersRepository");
const GetUsersSummaryUseCase = require("../../../application/usecase/getUsersSummaryUseCase");
const getUsersListController = require("../controller/users/getUsersList.Controller");

const repository = new UserRepository();
const useCase = new GetUsersSummaryUseCase(repository);
const controller = new getUsersListController(useCase);

router.get("/usuarios", (req, res) => controller.getUsersPage(req, res));
router.get("/api/usuarios", (req, res) => controller.getUsers(req, res));
module.exports = router;