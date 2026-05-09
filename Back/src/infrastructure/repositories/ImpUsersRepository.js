const db = require('../database/database');
const usersRepository = require('../../domain/repository/usersRepository');
const userSummary = require('../../domain/entity/userSummaryEntity');

class ImpUsersRepository extends usersRepository {
  async fetchActivePatients ({ search, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    // Get active Users, rol = 2, with pagination and a optional search filter
    const [rows] = await db.query(
      `SELECT 
                u.id_user AS id,
                CONCAT(u.first_name, ' ', u.lastname_p, ' ', COALESCE(u.lastname_m, '')) AS full_name,
                l.reference_number,
                l.neuro_status,
                l.protocol
            FROM users u
            LEFT JOIN user_info l ON l.id_user = u.id_user
            WHERE u.id_role = 2
              AND u.eliminated = 0
              AND (? IS NULL OR CONCAT(u.first_name, ' ', u.lastname_p, ' ', COALESCE(u.lastname_m, '')) LIKE ?)
            ORDER BY u.first_name ASC
            LIMIT ? OFFSET ?`,
      [searchParam, searchParam, Number(limit), Number(offset)]
    );
    return rows.map(row => new userSummary(row));
  }

  async countActivePatients ({ search }) {
    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    const [rows] = await db.query (
      `SELECT COUNT(*) AS total
            FROM users
            WHERE id_role = 2
              AND eliminated = 0
              AND (? IS NULL OR CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)`,
      [searchParam, searchParam]
    );
    return rows[0]?.total ?? 0;
  }

  async fetchNumberUsers ({ idClinicalUser }) {
    const [numbers] = await db.query (
      `SELECT 
        COUNT(*) AS totalUsers,
        SUM(CASE WHEN ui.protocol = 'Clinical' THEN 1 ELSE 0 END) as total_clinical,
        SUM(CASE WHEN ui.protocol = 'Research' THEN 1 ELSE 0 END) as total_research
      FROM users u
        JOIN user_info ui ON ui.id_user = u.id_user
        JOIN user_relation ur ON u.id_user = ur.id_user
      WHERE ur.id_clinic_user = ? AND ur.type = 'assigned' AND ui.state = 'Active';`,
      [idClinicalUser]
    );
    return numbers;
  }

  async fetchAllWithClinical ({ idClinicalUser }) {
    const [users] = await db.query (
      `SELECT ui.id_user, u.first_name, u.lastname_p, u.lastname_m
      FROM user_info ui
	      JOIN users u ON u.id_user = ui.id_user
	      JOIN user_relation ur ON ui.id_user = ur.id_user
      WHERE ur.id_clinic_user = 1 AND ur.type = 'assigned' AND ui.state = 'Active';`,
      [idClinicalUser]
    );
    return users;
  }
}
module.exports = ImpUsersRepository;
