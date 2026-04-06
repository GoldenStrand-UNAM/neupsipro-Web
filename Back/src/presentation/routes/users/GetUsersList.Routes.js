// Import Express 
const express = require('express');
 
const router = express.Router();
const UsuarioRepository = require('../../../infrastructure/repositories/usersRepository');
const GetUserListController = require('../../controller/users/GetUsersList.Controller');
const GetUsersSummaryUseCase = require('../../../application/usecase/getUsersSummaryUseCase');
 
const repository = new UsuarioRepository();
const useCase = new GetUsersSummaryUseCase(repository);
const controller = new GetUserListController(useCase);
 
router.get('/UsersList', (req, res) => controller.getUsuarios(req, res));
 
module.exports = router;
 