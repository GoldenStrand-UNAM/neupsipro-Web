const db = require ('../database/database');
const forumRepository = require('../../domain/repository/forumRepository');
const { v4: uuidv4 } = require('uuid');

// Repository responsable for fetching publications from the database with author info and pagination
class ImpForumRepository extends forumRepository {

  async count () {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM publication');
    return total;
  }

  // Page and limit for data pagination
  async fetchAll ({ page,limit }) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT 
                p.id_publication,
                p.title,
                p.content,
                p.image,
                p.time_and_date,
                CONCAT(u.first_name, ' ', u.lastname_p, ' ', u.lastname_m) AS full_name,
                u.profile_photo
            FROM publication p
            INNER JOIN users u 
                ON p.id_user = u.id_user
            ORDER BY p.time_and_date DESC
            LIMIT ?, ?`,
      [Number(offset), Number(limit)]
    );
    return rows;
  }
  // Inserts a new publication, return its generated id
  async save ({ id_usuario, titulo, contenido, image }) {
    const id = uuidv4();

    await db.query(
      `INSERT INTO publication (id_publication, id_user, title, content, image, time_and_date)
         VALUES (?, ?, ?, ?, ?, NOW())`,
      [id, id_usuario, titulo, contenido, image]
    );

    const [rows] = await db.query(
      'SELECT * FROM publication WHERE id_publication = ?',
      [id]
    );

    return rows[0];
  }
    async fetchOne ({ idPublication }) {
    const result = await db.query(
      `SELECT 
                p.id_user,
                p.time_and_date,
                p.title,
                p.content,
                p.image
            FROM publication p
            WHERE p.id_publication = ?`,
      [idPublication]
    );
    return result;
  }

  async fetchOneUser ({ idPublication }) {
    const result = await db.query(
      `SELECT 
                p.id_user,
                p.time_and_date,
                p.title,
                p.content,
                p.image,
                u.first_name,
                u.lastname_p,
                u.lastname_m,
                u.profile_photo 
            FROM publication p
            JOIN users u ON u.id_user = p.id_user
            WHERE p.id_publication = ?`,
      [idPublication]
    );
    return result;
  }

  // find publication
  async findById ({ idPublication }) {
    const [rows] = await db.query(
      `SELECT id_publication, id_user, title, image
       FROM publication
       WHERE id_publication = ?
       LIMIT 1`,
      [idPublication]
    );
    return rows.length ? rows[0] : null;
  }
  // delete publication by id
  async deletePublication ({ idPublication }) {
    const [result] = await db.query(
      'DELETE FROM publication WHERE id_publication = ?',
      [idPublication]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ImpForumRepository;
