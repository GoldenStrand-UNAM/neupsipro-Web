const db = require("../database/database");
const ImpUserRepository = require("../../domain/repository/ImpUserRepository");
const userSummary = require("../../domain/entity/userSummaryEntity");

class UsersRepository extends ImpUserRepository {
    async fetchActivePatients({ search, page, limit }) {
        const offset = (page - 1) * limit;
                const searchParam = search ? `%${search}%` : null;

        const [rows] = await db.query(
    `SELECT 
        folio,
        CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) AS full_name
    FROM users
    WHERE id_role = 2
      AND eliminated = 0
      AND (? IS NULL OR CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)
    ORDER BY user_name ASC
    LIMIT ? OFFSET ?`,
    [searchParam, searchParam, Number(limit), Number(offset)]
);
        
        return rows.map(row => new userSummary(row));

    }

    async countActivePatients({ search }) {
                const searchParam = search ? `%${search}%` : null;

         const [rows] = await db.query(
            `SELECT COUNT(*) AS total
            FROM users
            WHERE id_role = 2
              AND eliminated = 0
              AND (? IS NULL OR CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)`,
            [searchParam, searchParam]
        );
        console.log("COUNT rows:", JSON.stringify(rows));
        return rows[0]?.total ?? 0;
    }
}
module.exports = UsersRepository;