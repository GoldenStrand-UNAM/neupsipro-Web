const db = require ('../database/database');
const forumRepository = require('../../domain/repository/forumRepository');

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
}

module.exports = ImpForumRepository;
