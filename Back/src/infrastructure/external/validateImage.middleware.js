const fs = require('fs').promises;
const fileType = require('file-type');

const allowed_type = ['image/jpeg', 'image/png', 'image/webp'];
const max_size = 5 * 1024 * 1024;

const validateImageMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  const reject = async (status, message) => {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(status).json({ error: message });
  };

  try {
    if (req.file.size > max_size)
      return reject(500, 'Imagen demasiado pesada (max 5MB)');

    const detectedType = await fileType.fromFile(req.file.path);

    if (!detectedType)
      return reject(500, 'Archivo no reconocido como imagen válida');

    if (!allowed_type.includes(detectedType.mime))
      return reject(500, 'Solo se permiten imágenes JPG, PNG o WEBP');

    next();

  } catch (_err) {
    return reject(500, 'Error al validar la imagen');
  }
};

module.exports = validateImageMiddleware;
