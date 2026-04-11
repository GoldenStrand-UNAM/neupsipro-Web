const db = require ("../database/database");
const ImpUserRepository = require('../../domain/repository/impUserRepository');
const User = require("../../domain/entity/User");

class UserRepository extends ImpUserRepository {

    // Consult one User by id_user
    async fetchOne ({id_user}) {
        const [userData] = await db.query(
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
            FROM Logbook l
            JOIN users u ON l.id_user = u.id_user
            LEFT JOIN user_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            WHERE l.id_user = ?`,
            [id_user]
        );        

        return userData.map(row => new User(row));
    }
}


module.exports = UserRepository;