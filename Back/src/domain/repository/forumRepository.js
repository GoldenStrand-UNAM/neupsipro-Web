const database = require('../../infrastructure/database/database')

module.exports = class forumRepository {
    constructor () {}
    async getPublication (idPublication) {
        if(!idPublication || idPublication == '') {
            throw  new Error("Missing ID");
        } 
        try{
            const result = await database.query(
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
    async getInteractions (idPublication) {
        if(!idPublication || idPublication == '') {
            throw  new Error("Missing ID");
        }
        try{
            const result = await database.query(
                `SELECT 
                    i.id_interaction,
                    i.is_like,
                    i.content, 
                    i.date_and_time
                FROM interaction i
                JOIN publication p ON p.id_publication = i.id_publication
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
