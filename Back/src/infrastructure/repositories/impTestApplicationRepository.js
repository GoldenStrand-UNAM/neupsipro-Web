const db = require('../database/database');
const TestApplication           = require('../../domain/entity/testApplication');
const TestApplicationRepository = require('../../domain/repository/testApplicationRepository');
const { v4: uuidv4 }            = require('uuid');

class impTestApplicationsRepository extends TestApplicationRepository {

  async fetchTestApplications ({ id_user }) {
    const [testApplications] = await db.query(
      `SELECT *
       FROM test_applications ta
       WHERE ta.id_user = ?`,
      [id_user]
    );
    return testApplications.map(row => new TestApplication(row));
  }

  async saveApplication ({ id_user, application_name }) {
    const id_application = uuidv4();

    await db.query(
      `INSERT INTO test_applications (id_application, id_user, application_name, status, created_at)
       VALUES (?, ?, ?, 1, NOW())`,
      [id_application, id_user, application_name.trim()]
    );

    const [rows] = await db.query(
      'SELECT * FROM test_applications WHERE id_application = ?',
      [id_application]
    );

    return new TestApplication(rows[0]);
  }

  /**
   * Fetches the user record joined with user_info to retrieve the assigned protocol.
   * @returns {{ id_user: string, protocol: string } | null}
   */
  async fetchUserProtocol ({ id_user }) {
    const [rows] = await db.query(
      `SELECT u.id_user, ui.protocol
       FROM users u
       INNER JOIN user_info ui ON u.id_user = ui.id_user
       WHERE u.id_user = ? AND u.eliminated = 0`,
      [id_user]
    );

    return rows.length ? rows[0] : null;
  }

  // Fetch all test ids assigned to a protocol
  async fetchProtocolTests ({ protocol }) {
    const [rows] = await db.query(
      `SELECT pt.id_test, p.test_name, p.result_table
       FROM protocol_tests pt
       INNER JOIN psych_tests p ON pt.id_test = p.id_test
       WHERE pt.protocol = ?`,
      [protocol]
    );
    return rows; // [{ id_test, test_name, result_table }]
  }
}

module.exports = impTestApplicationsRepository;
