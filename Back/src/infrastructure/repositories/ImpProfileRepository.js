const profileRepository = require('../../domain/repository/profileRepository');
const userProfile = require('../../domain/entity/userProfile');
const db = require('../database/database');
const crypt = require('../crypt/profile/getProfile');

/**
 * Implementation for the repository using MySQL.
 * It does a JOIN between multiple tables to consolidate data.
 */
class ImpProfileRepository extends profileRepository {
  // eslint-disable-next-line max-lines-per-function
  async getUserId (userId) {
    const query = `
            SELECT
                u.first_name, u.lastname_p, u.lastname_m, u.profile_photo, u.birthdate,
                ui.registration_date, ui.neuro_entry_date, ui.neuro_status, ui.protocol, ui.state, ui.stage, ui.prosthetist,
                ur.id_user_relation, ur.type,
                uc.first_name AS assigned_clinic_name,
                (SELECT DATE(date_time)
                FROM appointment
                WHERE id_user_relation = ur.id_user_relation
                AND DATE(date_time) >= CURDATE()
                ORDER BY date_time ASC LIMIT 1) AS next_appointment_date,
                (SELECT TIME(date_time)
                FROM appointment
                WHERE id_user_relation = ur.id_user_relation
                AND DATE(date_time) >= CURDATE()
                ORDER BY date_time ASC LIMIT 1) AS next_appointment_time
            FROM users u
            LEFT JOIN user_info ui ON u.id_user = ui.id_user
            LEFT JOIN user_relation ur ON u.id_user = ur.id_user
            LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
            WHERE u.id_user = ?   
        `;
    const [rows] = await db.query(query, [userId]);
    if (!rows || rows.length === 0) {
      return null;
    }
    const baseRow = rows[0];
    const firstNameU = crypt.safeDecrypt(baseRow.first_name);
    const lastNamePU = crypt.safeDecrypt(baseRow.lastname_p);
    const lastNameMU = crypt.safeDecrypt(baseRow.lastname_m);
    const profilePhotoU = baseRow.profile_photo;
    const birthDateU = crypt.safeDecrypt(baseRow.birthdate);
    const registrationDateU = baseRow.registration_date;
    const neuroEntryDateU  = crypt.safeDecrypt(baseRow.neuro_entry_date);
    const neuroStatusU = crypt.safeDecrypt(baseRow.neuro_status);
    const protocolU = baseRow.protocol;
    const stateU = baseRow.state;
    const stageU = baseRow.stage;
    const prosthetistU = crypt.safeDecrypt(baseRow.prosthetist);

    const userRelationsU = rows.map(row => ({
      idUserRelation: row.id_user_relation,
      type: row.type,
      assignedClinic: crypt.safeDecrypt(row.assigned_clinic_name),
      nextAppointmentDate: row.next_appointment_date,
      nextAppointmentTime: row.next_appointment_time,
    }));

    const consolidatedUserData = {
      first_name: firstNameU,
      lastname_p: lastNamePU,
      lastname_m: lastNameMU,
      profile_photo: profilePhotoU,
      birthdate: birthDateU,
      registration_date: registrationDateU,
      neuro_entry_date: neuroEntryDateU,
      neuro_status: neuroStatusU,
      protocol: protocolU,
      state: stateU,
      stage: stageU,
      prosthetist: prosthetistU,
      relations: userRelationsU,
    };
    return new userProfile(consolidatedUserData);
  }
}

module.exports = ImpProfileRepository;
