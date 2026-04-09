const db = require ("../database/database");
const ImpLogbookRepository = require('../../domain/repository/impLogbookRepository');
const Logbook = require("../../domain/entity/Logbook");

class LogbookRepository extends ImpLogbookRepository {

    // Consult one logbook by id_user
    async fetchOne ({id_user}) {
        const [logbookData] = await db.query(
            `SELECT 
                l.*,
                u.first_name,
                u.lastname_p,
                u.lastname_m,
                u.profile_photo,
                u.birthdate,
                u.registration_date,
                u.reference_number,
                uc.first_name AS assigned_clinic
            FROM logbook l
            JOIN users u ON l.id_user = u.id_user
            LEFT JOIN user_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            WHERE l.id_user = ?`,
            [id_user]
        );        

        return logbookData.map(row => new Logbook(row));
    }
}


module.exports = LogbookRepository;