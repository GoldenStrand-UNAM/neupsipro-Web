const ImpProfileRepository = require('../../domain/repository/ImpProfileRepository');
const userProfile = require('../../domain/entity/userProfile');
const db = require('../database/database');

/**
 * Implementation for the repository using MySQL.
 * It does a JOIN between multiple tables to consolidate data.
 */
class profileRepository extends ImpProfileRepository {
    async getUserId (userId) {
        const query = `
            SELECT
                u.first_name, u.lastname_p, u.lastname_m, u.profile_photo, u.birthdate,
                ui.unit_entry_date, ui.neuro_entry_date, ui.neuro_status, ui.protocol, ui.state, ui.stage, ui.prosthetist,
                ur.id_user_relation,
                uc.first_name AS assigned_clinic_name,
                DATE(a.date_time) AS next_appointment_date,
                TIME(a.date_time) AS next_appointment_time
            FROM users u
            LEFT JOIN user_info ui ON u.id_user = ui.id_user
            LEFT JOIN user_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            LEFT JOIN (
                SELECT id_user_relation, date_time
                FROM appointment
                ORDER BY date_time ASC
                LIMIT 1
            ) a ON ur.id_user_relation = a.id_user_relation
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
            unitEntryDate: row.unit_entry_date,
            neuroEntryDate: row.neuro_entry_date,
            neuroStatus: row.neuro_status,
            protocol: row.protocol,
            state: row.state,
            stage: row.stage,
            prosthetist: row.prosthetist,
            idUserRelation: row.id_user_relation,
            assignedClinic: row.assigned_clinic_name,
            nextAppointmentDate: row.next_appointment_date,
            nextAppointmentTime: row.next_appointment_time,
        });
    }    
}

module.exports = profileRepository;
