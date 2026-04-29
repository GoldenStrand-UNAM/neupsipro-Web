const db = require ("../database/database");
const impForumRepository = require('../../domain/repository/ImpForumRepository');


// Repository responsable for fetching publications from the database with author info and pagination
class forumRepository extends impForumRepository {

    async count () {
        const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM publication`);
        return total;
    }

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
        async fetchOne ({idPublication}) {
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

    async fetchOneUser ({idPublication}) {
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
}


module.exports = forumRepository;