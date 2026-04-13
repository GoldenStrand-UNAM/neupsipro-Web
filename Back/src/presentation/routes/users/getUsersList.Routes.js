const express = require("express");
const router = express.Router();
const UserRepository = require("../../../infrastructure/repositories/usersRepository");
const GetUsersListUseCase = require("../../../application/usecase/users/getUserListUseCase");
const GetUsersListController = require("../../controller/users/GetUsersList.Controller");

const repository = new UserRepository();
const useCase = new GetUsersListUseCase(repository);
const controller = new GetUsersListController(useCase);

router.get("/usuarios", (req, res) => controller.getUsersPage(req, res));
router.get("/api/usuarios", (req, res) => controller.getUsers(req, res));
module.exports = router;