const express = require('express');
const multer = require('multer');
const RegPubliRep = require('../../../infrastructure/repositories/RegPubliRep');
const RegPublicationController = require('../../controller/forum/RegPublication.Controller');
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

const repository = new RegPubliRep();
const useCase = new RegPublicationUseCase(repository);
const controller = new RegPublicationController(useCase);


router.post('/Foro/registrar', upload.single('imagen'), (req, res) => controller.registerPublication(req, res));

module.exports = router;
