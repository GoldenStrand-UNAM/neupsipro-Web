const db = require ("../database/database");
const ImpForumRepository = require('../../domain/repository/ImpForumRepository');

class ForumRepository extends ImpForumRepository {
    async fetchOne({idPublication}) {
        try{
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
        } catch(err) {
            console.log(err)
            throw err;
        }
    }

    async fetchOneUser ({idPublication}) {
        try{
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
        } catch(err) {
            console.log(err)
            throw err;
        }
    }
}

module.exports = ForumRepository;