const express = require('express');
const multer = require('multer');
const RegPubliRep = require('../../../infrastructure/repositories/RegPubliRep');
const RegPublicationController = require('../../controller/forum/RegPublication.Controller');
const RegPublicationUseCase = require('../../../application/usecase/regPublicationUseCase');

const router = express.Router();

const repository = new RegPubliRep();
const useCase = new RegPublicationUseCase(repository);
const controller = new RegPublicationController(useCase);

router.post('/Foro/registrar', upload.single('imagen'), (req, res) => controller.registerPublication(req, res));

module.exports = router;
