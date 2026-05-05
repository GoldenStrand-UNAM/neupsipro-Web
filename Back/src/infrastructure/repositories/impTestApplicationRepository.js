const db = require ('../database/database');
const TestApplication = require('../../domain/entity/testApplication');
const TestApplicationRepository = require('../../domain/repository/testApplicationRepository');

class TestApplicationsRepository extends ImpApplicationRepository {
  async fetchTestSessions ({ id_user }) {
    const [testSessions] = await db.query(
      `SELECT *
      FROM test_applications ta
      WHERE ta.id_user = ?`,
      [id_user]
    );
    return testSessions.map(row => new TestSessions(row));
  }

  // New method for creating new application
   async saveApplication ({ id_user, application_name }) {
    const [result] = await db.query(
      `INSERT INTO test_applications (id_user, application_name, status, created_at)
       VALUES (?, ?, 6, NOW())`,
      [id_user, application_name.trim()]
    );

    // Fetch the inserted row to build a proper entity with all DB-generated fields
    const [rows] = await db.query(
      `SELECT * FROM test_applications WHERE id_application = ?`,
      [result.insertId]
    );

    return new TestApplication(rows[0]);
  }
}

module.exports = TestApplicationsRepository;
