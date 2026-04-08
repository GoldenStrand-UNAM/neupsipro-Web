const db = require ("../database/database");
const ImpForumRepository = require('../../domain/repository/ImpForumRepository');


// Repository responsable for fetching publications from the database with author info and pagination
class ForumRepository extends ImpForumRepository{

    // Page and limit for data pagination
    async fetchAll ({page,limit}) {
         const offset = (page - 1) * limit;
         const [rows] = await db.query(
            `SELECT 
                p.id_publication,
                p.title,
                p.content,
                p.image,
                p.time_and_date,
                CONCAT(u.user_name, ' ', u.lastname_p, ' ', u.lastname_m) AS full_name,
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
module.exports = ForumRepository;
