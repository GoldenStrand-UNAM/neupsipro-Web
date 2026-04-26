const db = require("../database/database");
const ImpUsersRepository = require("../../domain/repository/ImpUsersRepository");
const userSummary = require("../../domain/entity/userSummaryEntity");

class UsersRepository extends ImpUsersRepository {
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
            LEFT JOIN logbook l ON l.id_user = u.id_user
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
}
module.exports = UsersRepository;