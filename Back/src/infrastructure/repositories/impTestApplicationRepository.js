const db = require ('../database/database');
const TestApplication = require('../../domain/entity/testApplication');
const TestApplicationRepository = require('../../domain/repository/testApplicationRepository');
const { v4: uuidv4 } = require('uuid');


class impTestApplicationsRepository extends TestApplicationRepository {
  async fetchTestApplications({ id_user }) {
    const [testApplications] = await db.query(
      `SELECT *
      FROM test_applications ta
      WHERE ta.id_user = ?`,
      [id_user]
    );
    return testApplications.map(row => new TestApplication(row));
  }

  // New method for creating new application
   async saveApplication ({ id_user, application_name }) {
    const id_application = uuidv4();

    await db.query(
      `INSERT INTO test_applications (id_application, id_user, application_name, status, created_at)
       VALUES (?, ?, ?, 6, NOW())`,
      [id_application, id_user, application_name.trim()]
    );

    // Fetch the inserted row to build a proper entity with all DB-generated fields
    const [rows] = await db.query(
      `SELECT * FROM test_applications WHERE id_application = ?`,
      [id_application]
    );

    return new TestApplication(rows[0]);
  }
}

module.exports = impTestApplicationsRepository;
