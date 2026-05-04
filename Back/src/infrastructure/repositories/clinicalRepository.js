const db = require('../database/database');
const ImpClinicalRepository = require('../../domain/repository/ImpClinicalRepository');
const userClinicalSummary = require('../../domain/entity/userClinicalSummary');

class ClinicalRepository extends ImpClinicalRepository {
  async fetchActivePatients ({ search, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    // Get active Users, rol = 2, with pagination and a optional search filter
    const [rows] = await db.query (
      `SELECT 
                id_user AS id,
                CONCAT(first_name, ' ', lastname_p, ' ', lastname_m) AS full_name
            FROM users
            WHERE id_role = 1
            AND eliminated = 0
            AND (? IS NULL OR CONCAT(first_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)
            ORDER BY user_name ASC
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
            WHERE id_role = 1
              AND eliminated = 0
              AND (? IS NULL OR CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)`,
      [searchParam, searchParam]
    );
    return rows[0]?.total ?? 0;
  }
}
module.exports = ClinicalRepository;
