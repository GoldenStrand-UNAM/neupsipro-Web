const db = require('../database/database');
const ImpPubliRep = require('../../domain/repository/ImpForumRepository');

class RegPubliRep extends ImpPubliRep {

  // Inserts a new publication, return its generated id
  async save({ id_usuario, titulo, contenido, imagenes }) {
    const [result] = await db.query(
      `INSERT INTO publicacion (id_usuario, titulo, contenido, imagenes, fecha_y_hora)
       VALUES (?, ?, ?, ?, NOW())`,
      [id_usuario, titulo, contenido, imagenes],
    );

    const [rows] = await db.query(
      'SELECT * FROM publicacion WHERE id_publicacion = ?',
      [result.insertId],
    );

    return rows[0];
  }
}

module.exports = RegPubliRep;
