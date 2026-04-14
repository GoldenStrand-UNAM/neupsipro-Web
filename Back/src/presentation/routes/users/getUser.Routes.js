const express = require("express");
const router = express.Router();    

const UserController = require("../../controller/users/getUser.Controller");
const UsersRepository = require("../../../infrastructure/repositories/usersRepository");
const GetUserUseCase = require("../../../application/usecase/users/getUserUseCase");

const repository = new UsersRepository();
const useCase = new GetUserUseCase(repository);
const controller = new UserController(useCase);

router.get("/:id_user", (req, res) => controller.getUser(req, res));

router.get('/consultUser', (req, res) => {
    res.render('users/consultUser', {
        activePage: 'usuario',
        
    });
});

module.exports = router;