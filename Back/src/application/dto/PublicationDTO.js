
class PublicationDTO {
  constructor({ id_publicacion, titulo, contenido, imagenes, fecha_y_hora }) {
    this.id = id_publicacion;
    this.title = titulo;
    this.content = contenido;
    this.image = imagenes;
    this.date = fecha_y_hora;
  }

  static fromEntity(entity) {
    return new PublicationDTO({
      id_publicacion: entity.id_publicacion,
      titulo: entity.titulo,
      contenido: entity.contenido,
      imagenes: entity.imagenes,
      fecha_y_hora: entity.fecha_y_hora,
    });
  }
}

module.exports = PublicationDTO;