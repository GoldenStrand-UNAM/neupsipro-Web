const ImpProfileRepository = require('../../domain/repository/ImpProfileRepository');
const userProfile = require('../../domain/entity/userProfile');
const db = require('../database/database');

/**
 * Implementation for the repository using MySQL.
 * It does a JOIN between 'users' and 'user_info' to consolidate data.
 */
class profileRepository extends ImpProfileRepository {
    async getUserId (userId) {
        const query = `
            SELECT
                u.first_name, u.lastname_p, u.lastname_m, u.profile_photo, u.birthdate,
                ui.registration_date, ui.neuro_status, ui.protocol, ui.state, ui.prosthetist
            FROM users u
            INNER JOIN user_info ui ON u.id_user = ui.id_user
            WHERE u.id_user = ?    
        `;

        const [rows] = await db.query(query, [userId]);
        const row = rows[0];
        
        if (!row) return null;

        return new userProfile({
            firstName: row.first_name,
            lastNameP: row.lastname_p,
            lastNameM: row.lastname_m,
            profilePhoto: row.profile_photo,
            birthDate: row.birthdate,
            registrationDate: row.registration_date,
            neuroStatus: row.neuro_status,
            protocol: row.protocol,
            state: row.state,
            prosthetist: row.prosthetist,
        });
    }
}

module.exports = profileRepository;
