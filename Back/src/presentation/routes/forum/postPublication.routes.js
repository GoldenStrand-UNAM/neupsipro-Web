const express = require('express');
const ForumRepository = require('../../../infrastructure/repositories/ForumRepository');
const PostPublicationController = require('../../controller/forum/postPublication.Controller');
const RegPublicationUseCase = require('../../../application/usecase/forum/postPublicationUseCase');
const upload = require('../../../infrastructure/external/multer.service');
const s3UploadMiddleware = require('../../../infrastructure/external/s3.middleware');
const validateImageMiddleware = require('../../../infrastructure/external/validateImage.middleware');



const router = express.Router();

const repository = new ForumRepository();
const useCase = new RegPublicationUseCase(repository);
const controller = new PostPublicationController(useCase);

router.get('/forum/registrar', (req, res) => {
    res.render('Forum/postPublication', { activePage: 'foro' });
});

router.post('/forum/registrar', upload.single('imagen'), validateImageMiddleware, s3UploadMiddleware,  (req, res) => controller.registerPublication(req, res));

module.exports = router;