const db = require ("../database/database");
const ImpInteractionRepository = require('../../domain/repository/ImpInteractionRepository');

class InteractionRepository extends ImpInteractionRepository {
     async fetchAllFromOne ({idPublication}) {
        if(!idPublication || idPublication == '') {
            throw  new Error("Missing ID");
        }
        try{
            const result = await db.query(
                `SELECT 
                    i.id_interaction,
                    i.is_like,
                    i.content, 
                    i.date_and_time,
                    u.first_name,
                    u.lastname_p,
                    u.lastname_m,
                    u.profile_photo 
                FROM interaction i
                JOIN publication p ON p.id_publication = i.id_publication 
				JOIN users u ON u.id_user = i.id_user
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
module.exports = InteractionRepository;