const db = require('../database/database');
const usersRepository = require('../../domain/repository/usersRepository');
const userSummary = require('../../domain/entity/userSummaryEntity');
const User = require('../../domain/entity/User');

class ImpUsersRepository extends usersRepository {

  // Consult one User by id_user
  async fetchOne ({ id_user }) {
    const [userData] = await db.query(
      `SELECT 
      l.*,
      u.first_name,
      u.lastname_p,
      u.lastname_m,
      u.profile_photo,
      u.birthdate,
      ur.id_clinic_user, 
      uc.first_name AS assigned_clinic,
                
      -- Subquery to get next appointment
      (
        SELECT a.date_time 
        FROM appointment a
        -- Join w/user relation to know whose appointment this is
        JOIN user_relation ur_app ON a.id_user_relation = ur_app.id_user_relation
        WHERE ur_app.id_user = l.id_user 
        AND a.date_time >= NOW() 
        ORDER BY a.date_time ASC 
        LIMIT 1
      ) AS next_appointment

      FROM user_info l
      JOIN users u ON l.id_user = u.id_user
      LEFT JOIN user_relation ur ON u.id_user = ur.id_user AND ur.type = 'assigned'
      LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
      WHERE l.id_user = ?;`,
      [id_user]
    );
    return userData.map(row => new User(row));
  }

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
                l.state,
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
              AND (? IS NULL OR CONCAT(first_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)`,
      [searchParam, searchParam]
    );
    return rows[0]?.total ?? 0;
  }
  async softDeleteUser ({ id_user }) {
    const [result] = await db.query(
      `UPDATE users 
        SET eliminated = 1 
      WHERE id_user = ? 
        AND eliminated = 0`,
      [id_user]
    );
    return result.affectedRows > 0;
  }
}
module.exports = ImpUsersRepository;
