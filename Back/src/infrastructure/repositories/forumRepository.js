const db = require ("../database/database");
const IForumRepository = require('../../domain/repository/ImpForumRepository');

class ForumRepository extends IForumRepository{
    async fetchAll ({page,limit}) {
         const offset = (page - 1) * limit;
         const rows = await db.query(
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
                ON p.id_user = u.id_user;`,
            [limit, offset]
        );
        return rows;
    }
}


module.exports = ForumRepository;
