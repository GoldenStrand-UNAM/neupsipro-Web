const db = require ('../database/database');
const Tests = require('../../domain/entity/tests');
const resultRepository = require('../../domain/repository/resultRepository');
const { v4: uuidv4 } = require('uuid');

class impTestResultsRepository extends resultRepository {

  // Validate that a application exist before getting the tests
  async fetchApplicationById ({ id_application }) {
    const [rows] = await db.query(
      `SELECT id_application, id_user, application_name, status, created_at
       FROM test_applications
       WHERE id_application = ?`,
      [id_application]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      idApplication: row.id_application,
      idUser: row.id_user,
      applicationName: row.application_name,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  //Fetch all test for a specific application
  async fetchTestsByApplication ({ id_user, id_application }) {
    const [rows] = await db.query(
      `SELECT tr.id_results,
              tr.id_application,
              tr.id_test,
              pt.test_name,
              pt.result_table,
              tr.status,
              tr.date_applied,
              tr.notes
       FROM test_results tr
       JOIN psych_tests pt ON tr.id_test = pt.id_test
       WHERE tr.id_user        = ?
         AND tr.id_application = ?`,
      [id_user, id_application]
    );
    return rows.map(row => new Tests(row));
  }

  //New method for insert one result row per test in the resolved protocol
  async createResults (id_application, id_user, tests) {
    if (!tests || tests.length === 0) return [];

    // Build multi-row INSERT: one placeholder group per test
    const placeholders = tests.map(() => '(?, ?, ?, ?, 1)').join(', ');
    const values       = tests.flatMap(test => [
      uuidv4(), 
      id_user, 
      id_application, 
      test.id_test
    ]);

    const [result] = await db.query(
      `INSERT INTO test_results (id_results, id_user, id_application, id_test, status)
       VALUES ${placeholders}`,
      values
    );

    return result;
  }



  // Fetch the schooling level of a user from their initial interview.

  async fetchUserSchooling ({ id_user }) {
    const [rows] = await db.query(
      `SELECT ii.schooling
     FROM initial_interview ii
     INNER JOIN user_relation ur ON ii.id_user_relation = ur.id_user_relation
     WHERE ur.id_user = ?
     LIMIT 1`,
      [id_user]
    );
    // eslint-disable-next-line no-console
    console.log('[fetchUserSchooling] id_user:', id_user, '| rows:', rows);
    return rows.length ? rows[0].schooling : null;
  }

  // Fetch age of user for REY test
  async fetchUserAge ({ id_user }) {
    const [rows] = await db.query(
      `SELECT birthdate
     FROM users
     WHERE id_user = ?`,
      [id_user]
    );
    return rows.length ? rows[0].birthdate : null;
  }

}

module.exports = impTestResultsRepository;
