const express = require('express');
const multer = require('multer');
const ForumRepository = require('../../../infrastructure/repositories/ForumRepository');
const PostPublicationController = require('../../controller/forum/PostPublication.Controller');
const RegPublicationUseCase = require('../../../application/usecase/regPublicationUseCase');

const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
    }
  },
});

const router = express.Router();

const repository = new ForumRepository();
const useCase = new RegPublicationUseCase(repository);
const controller = new PostPublicationController(useCase);

router.get('/Foro/registrar', (req, res) => {
    res.render('Forum/postPublication', { activePage: 'foro' });
});

router.post('/Foro/registrar', upload.single('imagen'), (req, res) => controller.registerPublication(req, res));

module.exports = router;
