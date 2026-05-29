const db = require('../database/database');
const DashboardRepository = require('../../domain/repository/dashboardUnitRepository');
const crypt = require('../crypt/dashboard/dashboardUnitUsers');
const crypt2 = require('../crypt/dashboard/dashboardClinicalUsersInfo');

const {
  DashboardCountsEntity,
  AgeBucketEntity,
  GenderBucketEntity,
  TestCountEntity,
  StandByDetailEntity,
} = require('../../domain/entity/dashboardUnitEntity');

/*
*  NOTE : this repoImp is more complex than others because it has to do a lot of data processing
*  and classification in SQL to minimize the amount of logic in the use case, the queries were
*  made with AI help
*/
class ImpDashboardRepository extends DashboardRepository {

  // Classifies each active patient into one mutually exclusive bucket & returns totals.
  async fetchCounts () {
    const [rows] = await db.query(`
      SELECT
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
        WHERE u.eliminated = 0
          AND u.id_role = 2
      ) AS classified;
    `);
    return new DashboardCountsEntity(rows[0] || {});
  }

  async fetchAgeDistribution () {
    const [rows] = await db.query(`
    SELECT TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age
    FROM users u
    JOIN user_info ui ON ui.id_user = u.id_user
    WHERE u.eliminated = 0
      AND u.id_role = 2
      AND u.birthdate IS NOT NULL
      AND (ui.state IS NULL OR ui.state <> 'Declined')
  `);
    return rows.map(r => Number(r.age));
  }

  // Counts patients by gender
  async fetchGenderDistribution () {
    const [rows] = await db.query(`
      SELECT
        COALESCE(u.gender, 'Not specified') AS gender,
        COUNT(*) AS total
      FROM users u
      JOIN user_info ui ON ui.id_user = u.id_user
      WHERE u.eliminated = 0
        AND u.id_role = 2
        AND (ui.state IS NULL OR ui.state <> 'Declined')
      GROUP BY gender;
    `);
    return rows.map(r => new GenderBucketEntity(r));
  }
  // Counts how many results exist per psychological test
  async fetchTestCounts () {
    const [rows] = await db.query(`
      SELECT
        pt.id_test,
        pt.test_name,
        COUNT(tr.id_results) AS total
      FROM psych_tests pt
      LEFT JOIN test_results tr ON tr.id_test = pt.id_test
      GROUP BY pt.id_test, pt.test_name
      ORDER BY pt.id_test;
    `);
    return rows.map(r => new TestCountEntity(r));
  }
  // get all the active users that are not eliminated and in the standBy state
  async fetchStandByList () {
    const [rows] = await db.query(`
      SELECT ui.reference_number
      FROM user_info ui
      JOIN users u ON u.id_user = ui.id_user
      WHERE u.eliminated = 0
        AND u.id_role = 2
        AND ui.state = 'Stand_by'
      ORDER BY ui.reference_number ASC;
    `);
    const uncrypted = rows.map(row => crypt(row));
    return uncrypted.map(r => r.reference_number);
  }

  // Returns full detail of one standBy user
  async fetchStandByDetail (referenceNumber) {
    const [rows] = await db.query(`
    SELECT
      u.id_user,
      ui.reference_number,
      u.first_name,
      u.lastname_p,
      u.lastname_m,
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
      ui.registration_date,
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
    WHERE ui.reference_number = ?
      AND ui.state = 'Stand_by'
      AND u.eliminated = 0
    LIMIT 1;
  `, [referenceNumber]);

    if (!rows.length) return null;
    const uncrypt = rows.map(row => crypt2(row));
    return new StandByDetailEntity(uncrypt[0]);
  }
}

module.exports = ImpDashboardRepository;
