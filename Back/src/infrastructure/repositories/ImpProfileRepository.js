const profileRepository = require('../../domain/repository/profileRepository');
const userProfile = require('../../domain/entity/userProfile');
const db = require('../database/database');
const crypt = require('../crypt/profile/getProfile');

/**
 * Implementation for the repository using MySQL.
 * It does a JOIN between multiple tables to consolidate data.
 */
class ImpProfileRepository extends profileRepository {
  async getUserId (userId) {
    const query = `
            SELECT
                u.first_name, u.lastname_p, u.lastname_m, u.profile_photo, u.birthdate,
                ui.registration_date, ui.neuro_entry_date, ui.neuro_status, ui.protocol, ui.state, ui.stage, ui.prosthetist,
                ur.id_user_relation,
                uc.first_name AS assigned_clinic_name,
                (SELECT DATE(date_time)
                FROM appointment
                WHERE id_user_relation = ur.id_user_relation
                AND date_time >= NOW()
                ORDER BY date_time ASC LIMIT 1) AS next_appointment_date,
                (SELECT TIME(date_time)
                FROM appointment
                WHERE id_user_relation = ur.id_user_relation
                AND date_time >= NOW()
                ORDER BY date_time ASC LIMIT 1) AS next_appointment_time
            FROM users u
            LEFT JOIN user_info ui ON u.id_user = ui.id_user
            LEFT JOIN user_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            WHERE u.id_user = ?    
        `;
    const [rows] = await db.query(query, [userId]);
    const row = rows[0];
    if (!row) return null;
    const uncrypted = crypt(row);
    return new userProfile({
      firstName: uncrypted.first_name,
      lastNameP: uncrypted.lastname_p,
      lastNameM: uncrypted.lastname_m,
      profilePhoto: uncrypted.profile_photo,
      birthDate: uncrypted.birthdate,
      registrationDate: uncrypted.registration_date,
      neuroEntryDate: uncrypted.neuro_entry_date,
      neuroStatus: uncrypted.neuro_status,
      protocol: uncrypted.protocol,
      state: uncrypted.state,
      stage: uncrypted.stage,
      prosthetist: uncrypted.prosthetist,
      idUserRelation: uncrypted.id_user_relation,
      assignedClinic: uncrypted.assigned_clinic_name,
      nextAppointmentDate: uncrypted.next_appointment_date,
      nextAppointmentTime: uncrypted.next_appointment_time,
    });
  }
}

module.exports = ImpProfileRepository;
