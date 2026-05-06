const { uploadToS3 } = require('./s3.config');

const s3UploadMiddleware = async (req, res, next) => {
  //if there is no file, skip middleware
  if (!req.file) return next();

  try {
    // title of the publication as the name of the file in S3
    const titlePublication = (req.body.titulo || 'sin-titulo')
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .substring(0, 20);

    // moment of publication
    const timestamp = Date.now();

    // file extension
    const ext = req.file.originalname.split('.').pop();

    // final unique name for the file in S3
    const nameFileS3 = `${titlePublication}_${timestamp}_.${ext}`;

    // Upload to bucketS3 and get the publicURL
    const s3Url = await uploadToS3(req.file.path, nameFileS3);

    req.file.s3Location = s3Url;
    next();
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error('S3 upload error:', err);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }

};

module.exports = s3UploadMiddleware;
