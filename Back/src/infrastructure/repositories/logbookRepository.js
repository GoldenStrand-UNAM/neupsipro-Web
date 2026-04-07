const db = require ("../database/database");
const ImpLogbookRepository = require('../../domain/repository/impLogbookRepository');


// Repository responsable for fetching publications from the database with author info and pagination
class LogbookRepository extends ImpLogbookRepository {

    // Page and limit for data pagination
    async fetchOne ({id_user}) {
        const [logbookData] = await db.query(
            `SELECT 
                l.*,
                u.first_name,
                u.lastname_p,
                u.lastname_m,
                u.profile_photo,
                u.birthday,
                u.registration_date,
                u.reference_number,
                uc.first_name AS assigned_clinic
            FROM logbook l
            JOIN users u ON l.id_user = u.id_user
            LEFT JOIN users_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            WHERE id_user = ?`,
            [id_user]
        );        

        return logbookData;
    }
}


module.exports = LogbookRepository;