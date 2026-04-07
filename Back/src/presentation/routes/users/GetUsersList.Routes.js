const express      = require("express");
const router       = express.Router();
const UserRepository  = require("../../../infrastructure/repositories/usersRepository");
const GetUsersSummaryUseCase = require("../../../application/usecase/getUsersSummaryUseCase");
const GetUsersListController = require("../../controller/users/GetUsersList.Controller");

const repository = new UserRepository();
const useCase    = new GetUsersSummaryUseCase(repository);
const controller = new GetUsersListController(useCase);

router.get("/usuarios", (req, res) => controller.getUsers(req, res));
module.exports = router;