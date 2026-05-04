const express = require("express");
const router = express.Router();    

const UserController = require("../../controller/users/getUser.controller");
const UsersRepository = require("../../../infrastructure/repositories/usersRepository");
const TestSessionsRepository = require("../../../infrastructure/repositories/testSessionRepository");
const GetUserUseCase = require("../../../application/usecase/users/getUserUseCase");

const repository = new UsersRepository();
const tsRepository = new TestSessionsRepository();
const useCase = new GetUserUseCase(repository, tsRepository);
const controller = new UserController(useCase);

router.get("/:id_user", (req, res) => controller.getUser(req, res));

router.get('/consultUser', (req, res) => {
    res.render('users/consultUser', {
        activePage: 'usuario',
        
    });
});

module.exports = router;