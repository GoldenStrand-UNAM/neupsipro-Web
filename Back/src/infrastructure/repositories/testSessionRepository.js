const db = require ("../database/database");
const TestSessions = require("../../domain/entity/testSessions")

class TestSessionsRepository {
    async fetchTestSessions ({id_user}) {
        const [testSessions] = await db.query(
            `SELECT *
         FROM test_sessions ts
         WHERE ts.id_user = ?`,
        [id_user]
    );
    return testSessions.map(row => new TestSessions(row)); 
    }
}

module.exports = TestSessionsRepository;