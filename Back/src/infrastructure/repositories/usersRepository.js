const db = require('../database/database');
const ImpUserRepository = require('../../domain/repository/ImpUserRepository');
const userSummaryEntity = require('../../domain/entity/userSummaryEntity');

class usersRepository extends ImpUserRepository {
    async fetchAll() {
        const [rows] = await db.query(
            `SELECT
                u.id_user,
                u.user_name,
                u.lastname_p,
                u.lastname_m,
                lb.neuro_status,
                CASE
                    WHEN lb.initial_interview IS NOT NULL AND lb.initial_interview > 0 THEN 1
                    ELSE 0
                END AS initial_interview
            FROM users u
            LEFT JOIN logbook lb ON u.id_user = lb.id_user
            WHERE u.eliminated = 0
                AND u.id_role = 2
            ORDER BY u.lastname_p, u.lastname_m, u.user_name`,
        );
        return rows.map(row => new userSummaryEntity(row));
    }
}

module.exports = usersRepository;