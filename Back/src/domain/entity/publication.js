
class Publication {
  constructor ( { id_publicacion, id_usuario, titulo, contenido, image, fecha_y_hora } ) {
    this._validate (titulo);

    this.id_publicacion = id_publicacion || null;
    this.id_usuario = id_usuario;
    this.titulo = titulo.trim();
    this.contenido = contenido || null;
    this.image = image || null; // string with URL of image, S3
    this.fecha_y_hora = fecha_y_hora || null;
  }

  _validate (titulo) {
    if (!titulo || titulo.trim().length === 0) {
      throw new Error('El título es obligatorio');
    }
    if (titulo.trim().length > 100) {
      throw new Error('El título no puede superar 100 caracteres');
    }
  }

  setId (id) {
    this.id_publicacion = id;
  }
}

module.exports = Publication;