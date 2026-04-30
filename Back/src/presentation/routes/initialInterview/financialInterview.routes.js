const express = require("express");
const router = express.Router();    

const FIController = require("../../controller/inicialInterview/financialInterview.controller");
const FIRepository = require("../../../infrastructure/repositories/financialInterviewRepository");
const GetFIUseCase = require("../../../application/usecase/inicialInterview/financialInterviewUseCase");

const repository = new FIRepository();
const useCase = new GetFIUseCase(repository);
const controller = new FIController(useCase);

router.get("/", (req, res) => controller.getFinancialInterview(req, res));

// router.get('/consultUser', (req, res) => {
//     res.render('users/consultUser', { 
//         activePage: 'usuario',
        
//     });
// });

module.exports = router;