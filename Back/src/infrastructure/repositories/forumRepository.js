const db = require ("../database/database");
const ImpForumRepository = require('../../domain/repository/ImpForumRepository');


// Repository responsable for fetching publications from the database with author info and pagination
class ForumRepository extends ImpForumRepository {

    // Page and limit for data pagination
    async fetchAll ({_page,_limit}) {
         const offset = (_page - 1) * _limit;
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
            [Number(offset), Number(_limit)]
        );
        return rows;
    }
}


module.exports = ForumRepository;
