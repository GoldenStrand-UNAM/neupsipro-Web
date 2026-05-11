const db = require('../database/database');
const clinicalRepository = require('../../domain/repository/clinicalRepository');
const userClinicalSummary = require('../../domain/entity/userClinicalSummary');

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
  //get all clinical users
  async fetchAll () {
  const [rows] = await db.query(
    `SELECT 
        u.id_user AS id,
        CONCAT_WS(' ', u.first_name, u.lastname_p, u.lastname_m) AS full_name
     FROM users u
     WHERE u.id_role = 3 AND u.eliminated = 0
     ORDER BY u.first_name ASC`
  );
  return rows;
}
}
module.exports = ImpClinicalRepository;
