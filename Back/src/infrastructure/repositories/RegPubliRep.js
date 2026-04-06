const db = require('../database/database');
const ImpPubliRep = require('../../domain/repository/ImpPubliRep');

class RegPubliRep extends ImpPubliRep {

  // Inserts a new publication, return its generated id
  async save({ id_usuario, titulo, contenido, imagenes }) {
    const [result] = await db.query(
      `INSERT INTO publication (id_user, title, content, image, time_and_date)
     VALUES (?, ?, ?, ?, NOW())`,
      [id_usuario, titulo, contenido, imagenes],
    );

    const [rows] = await db.query(
      'SELECT * FROM publication WHERE id_publication = ?',
      [result.insertId],
    );

    return rows[0];
  }
}

module.exports = RegPubliRep;
