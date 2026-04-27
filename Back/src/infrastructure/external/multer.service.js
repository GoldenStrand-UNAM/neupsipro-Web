const multer = require('multer');
const path = require('path');

/*  Save file temporarily to disk before uploading to S3 
    where the file will be saved and what name it will have
*/
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadPath = path.join(__dirname,'../../../../front/public/uploads/');
    callback(null, uploadPath); 
  },
  filename: function (req, file, callback) {
    // Unique name wtith date
    const uniqueName = `${Date.now()}_${file.originalname}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage : storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max

  //filter to validate
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
    }
  },
});

module.exports = upload;