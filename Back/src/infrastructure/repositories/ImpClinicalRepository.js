const db = require('../database/database');
const clinicalRepository = require('../../domain/repository/clinicalRepository');
const userClinicalSummary = require('../../domain/entity/userClinicalSummary');
const Clinical = require('../../domain/entity/clinical');
const ClinicalPatient = require('../../domain/entity/clinicalPatient');

class ImpClinicalRepository extends clinicalRepository {
  async fetchActivePatients ({ search, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    // Get active Users, rol = 2, with pagination and a optional search filter
    const [rows] = await db.query (
      `SELECT 
            u.id_user AS id,
            CONCAT_WS(' ', u.first_name, u.lastname_p, u.lastname_m) AS full_name,
            uc.affiliation AS affiliation,
            uc.activity    AS activity,
            (
              SELECT COUNT(*)
              FROM user_relation ur
              WHERE ur.id_clinic_user = u.id_user
                AND ur.type = 'assigned'
            ) AS assigned_count
        FROM users u
        LEFT JOIN user_clinical uc ON uc.id_user = u.id_user
        WHERE u.id_role = 3
          AND u.eliminated = 0
          AND (? IS NULL 
              OR CONCAT_WS(' ', u.first_name, u.lastname_p, u.lastname_m) LIKE ?)
        ORDER BY u.user_name ASC
        LIMIT ? OFFSET ?`,
      [searchParam, searchParam, Number(limit), Number(offset)]
    );
    return rows.map(row => new userClinicalSummary(row));
  }

  async countActivePatients ({ search }) {
    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    const [rows] = await db.query (
      `SELECT COUNT(*) AS total
            FROM users
            WHERE id_role = 3
              AND eliminated = 0
              AND (? IS NULL OR CONCAT_WS(' ', first_name, lastname_p, lastname_m) LIKE ?)`,
      [searchParam, searchParam]
    );
    return rows[0]?.total ?? 0;
  }

  async fetchClinical ({ id_user }) {
    const [clinicalData] = await db.query (`SELECT 
      u.id_user,
      u.first_name, 
      u.lastname_p, 
      u.lastname_m,
      u.email,
      uc.affiliation,
      uc.activity,
      uc.emergency_contact_name,
      uc.emergency_contact_phone,
      uc.emergency_contact_relation,
      uc.start_date,
      uc.finish_date,
      uc.hours
  FROM users u
  LEFT JOIN user_clinical uc ON u.id_user = uc.id_user
  WHERE u.id_user = ?;`, [id_user]);
    return clinicalData.map(row => new Clinical(row));
  }

  async fetchPatientsAssigned ({ id_user, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const [patientsData] = await db.query (`SELECT 
    p.id_user,
    p.first_name, 
    p.lastname_p, 
    p.lastname_m,
    ui.state,
    ui.reference_number,
    ur.assignment_date,
    ur.type
FROM user_relation ur
INNER JOIN users p ON ur.id_user = p.id_user
LEFT JOIN user_info ui ON p.id_user = ui.id_user
WHERE ur.id_clinic_user = ? 
  AND p.eliminated = 0 
LIMIT ? OFFSET ?;`, [id_user, Number(limit), Number(offset)]);
    const [[{ total }]] = await db.query(`
    SELECT COUNT(*) as total
    FROM user_relation ur
    WHERE ur.id_clinic_user = ?;
  `, [id_user]);

    const totalPages = Math.ceil(total / limit);

    return {
      patients: patientsData.map(row => new ClinicalPatient(row)),
      totalPages,
      page,
    };
  }
}
module.exports = ImpClinicalRepository;
