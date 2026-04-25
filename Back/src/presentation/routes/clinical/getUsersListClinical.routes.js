const express = require("express");
const router = express.Router();
const ClinicalRepository = require("../../../infrastructure/repositories/clinicalRepository");
const getClinicalListUseCase = require("../../../application/usecase/clinical/getClinicalListUseCase");
const getUsersClinicalListController = require("../../controller/clinical/getUsersListClinical.controller");

const repository = new ClinicalRepository();
const useCase = new getClinicalListUseCase(repository);
const controller = new getUsersClinicalListController(useCase);

router.get("/clinico", (req, res) => controller.getUsersPage(req, res));
router.get("/api/usuarios-clinicos", (req, res) => controller.getUsers(req, res));
module.exports = router;