const db = require('../database/database');
const clinicalDashboardRepository = require('../../domain/repository/clinicalDashboardRepository');

class ImpClinicalDashboardRepository extends clinicalDashboardRepository {
  async fetchNumberUsers ({ idClinicalUser }) {
    const [numbers] = await db.query (
      `SELECT
        SUM(CASE WHEN bucket != 'excluded' THEN 1 ELSE 0 END) AS total_users,
        SUM(CASE WHEN bucket = 'discharged'      THEN 1 ELSE 0 END) AS discharged,
        SUM(CASE WHEN bucket = 'in_intervention' THEN 1 ELSE 0 END) AS in_intervention,
        SUM(CASE WHEN bucket = 'stand_by'        THEN 1 ELSE 0 END) AS stand_by,
        SUM(CASE WHEN bucket = 'clinical'        THEN 1 ELSE 0 END) AS clinical,
        SUM(CASE WHEN bucket = 'research'        THEN 1 ELSE 0 END) AS research,
        SUM(CASE WHEN bucket = 'no_protocol'     THEN 1 ELSE 0 END) AS no_protocol
      FROM (
        SELECT
          CASE
            WHEN ui.state = 'Discharged'                                      THEN 'discharged'
            WHEN ui.state = 'Active' AND ui.stage IN ('Initial', 'Following') THEN 'in_intervention'
            WHEN ui.state = 'Stand_by'                                        THEN 'stand_by'
            WHEN ui.state = 'Active' AND ui.protocol = 'Clinical'             THEN 'clinical'
            WHEN ui.state = 'Active' AND ui.protocol = 'Research'             THEN 'research'
            WHEN ui.protocol = 'Pending'                                      THEN 'no_protocol'
            ELSE 'excluded'
          END AS bucket
        FROM user_info ui
        JOIN users u ON u.id_user = ui.id_user
        JOIN user_relation ur ON u.id_user = ur.id_user
        WHERE u.eliminated = 0
          AND u.id_role = 2
          AND ur.id_clinic_user = ?
		  AND ur.type = 'assigned'
      ) AS classified;`,
      [idClinicalUser]
    );
    return numbers;
  }
  async fetchHistoricalNumberUsers ({ idClinicalUser }) {
    const [historicalNumbers] = await db.query (
      `SELECT
        COUNT(*) AS total_users,
        SUM(CASE WHEN bucket = 'discharged'      THEN 1 ELSE 0 END) AS discharged,
        SUM(CASE WHEN bucket = 'in_intervention' THEN 1 ELSE 0 END) AS in_intervention,
        SUM(CASE WHEN bucket = 'stand_by'        THEN 1 ELSE 0 END) AS stand_by,
        SUM(CASE WHEN bucket = 'clinical'        THEN 1 ELSE 0 END) AS clinical,
        SUM(CASE WHEN bucket = 'research'        THEN 1 ELSE 0 END) AS research,
        SUM(CASE WHEN bucket = 'no_protocol'     THEN 1 ELSE 0 END) AS no_protocol
      FROM (
        SELECT
          CASE
            WHEN ui.state = 'Discharged'                                      THEN 'discharged'
            WHEN ui.stage IN ('Initial', 'Following')                         THEN 'in_intervention'
            WHEN ui.state = 'Stand_by'                                        THEN 'stand_by'
            WHEN ui.protocol = 'Clinical'                                     THEN 'clinical'
            WHEN ui.protocol = 'Research'                                     THEN 'research'
            WHEN ui.protocol = 'Pending'                                      THEN 'no_protocol'
            ELSE 'excluded'
          END AS bucket
        FROM user_info ui
        JOIN users u ON u.id_user = ui.id_user
        JOIN user_relation ur ON u.id_user = ur.id_user
        WHERE u.eliminated = 0
          AND u.id_role = 2
          AND ur.id_clinic_user = ?
		  AND ur.type = 'assigned'
      ) AS classified;`,
      [idClinicalUser]
    );
    return historicalNumbers;
  }
  async fetchAllWithClinical ({ idClinicalUser }) {
    const [users] = await db.query (
      `SELECT ui.id_user, u.first_name, u.lastname_p, u.lastname_m
      FROM user_info ui
	      JOIN users u ON u.id_user = ui.id_user
	      JOIN user_relation ur ON ui.id_user = ur.id_user
      WHERE ur.id_clinic_user = ? AND ur.type = 'assigned' AND ui.state = 'Active';`,
      [idClinicalUser]
    );
    return users;
  }

  async fetchInfoUser ({ idUser }) {
    const [userInfo] = await db.query (`
      SELECT
        u.id_user,
        ui.reference_number,
        CONCAT(u.first_name, ' ', u.lastname_p, ' ', COALESCE(u.lastname_m, '')) AS full_name,
        u.birthdate,
        u.profile_photo, 
        (
          SELECT ii.schooling
          FROM user_relation ur
            JOIN initial_interview ii ON ii.id_user_relation = ur.id_user_relation
          WHERE ur.id_user = u.id_user AND ur.type = 'initial_interview'
          ORDER BY ur.assignment_date DESC
          LIMIT 1
        ) AS schooling,
        ui.unit_entry_date,
        ui.neuro_entry_date,
        ui.amputation_date,
        ui.protocol,
        (
          SELECT GROUP_CONCAT(
            CONCAT(cu.first_name, ' ', cu.lastname_p)
          ORDER BY ur.assignment_date DESC
            SEPARATOR '|'
        )
        FROM user_relation ur
        JOIN users cu ON cu.id_user = ur.id_clinic_user
        WHERE ur.id_user = u.id_user AND ur.type = 'assigned'
        ) AS assigned_clinics
        FROM user_info ui
          JOIN users u ON u.id_user = ui.id_user
        WHERE ui.id_user = ?
          AND u.eliminated = 0
        LIMIT 1;
      `, [idUser]);
    if (!userInfo.length) return null;
    return userInfo;
  }
}
module.exports = ImpClinicalDashboardRepository;
