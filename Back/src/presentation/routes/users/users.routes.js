const express = require("express");
const router = express.Router();    

const UsersController = require("../../controller/users.controllers");
const LogbookRepository = require("../../../infrastructure/repositories/logbookRepository");
const ConsultLogbookUseCase = require("../../../application/usecase/consultLogbookUseCase");

const repository = new LogbookRepository();
const useCase = new ConsultLogbookUseCase(repository);
const controller = new UsersController(useCase);

router.get("/logbook/:id_user", (req, res) => controller.getLogbook(req, res));

module.exports = router;