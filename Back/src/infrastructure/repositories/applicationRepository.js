const db = require ('../database/database');
const TestSessions = require('../../domain/entity/testApplication');

class TestApplicationsRepository {
  async fetchTestSessions ({ id_user }) {
    const [testSessions] = await db.query(
      `SELECT *
      FROM test_applications ta
      WHERE ta.id_user = ?`,
      [id_user]
    );
    return testSessions.map(row => new TestSessions(row));
  }
}

module.exports = TestApplicationsRepository;
