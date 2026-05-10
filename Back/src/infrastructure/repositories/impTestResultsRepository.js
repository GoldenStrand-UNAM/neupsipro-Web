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
              tr.status,
              tr.score,
              tr.interpretation,
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
    const placeholders = tests.map(() => '(?, ?, ?, ?, 6)').join(', ');
    const values       = tests.flatMap(id_test => [uuidv4(), id_user, id_application, id_test]);

    const [result] = await db.query(
      `INSERT INTO test_results (id_results, id_user, id_application, id_test, status)
       VALUES ${placeholders}`,
      values
    );

    return result;
  }

  //Fetch a single result row to validate it exists before saving.
  async fetchResultRow ({ id_user, id_application, id_test }) {
    const [rows] = await db.query(
      `SELECT id_results, status
       FROM test_results
       WHERE id_user        = ?
         AND id_application = ?
         AND id_test        = ?`,
      [id_user, id_application, id_test]
    );
    if (rows.length === 0) return null;
    return {
      idResults: rows[0].id_results,
      status: rows[0].status,
    };
  }

  //Update an existing result row with score, interpretation, notes and status.
  async saveResult ({ id_results, score, interpretation, notes }) {
    await db.query(
      `UPDATE test_results
       SET score          = ?,
           interpretation = ?,
           notes          = ?,
           date_applied   = CURDATE(),
           status         = 3
       WHERE id_results = ?`,
      [score, interpretation, notes ?? null, id_results]
    );

    // Return the updated row as a Tests entity
    const [rows] = await db.query(
      `SELECT tr.id_results, tr.id_application, tr.id_test,
              pt.test_name, tr.status, tr.score,
              tr.interpretation, tr.date_applied, tr.notes
       FROM test_results tr
       JOIN psych_tests pt ON tr.id_test = pt.id_test
       WHERE tr.id_results = ?`,
      [id_results]
    );
    return new Tests(rows[0]);
  }

  // Fetch the schooling level of a user from their initial interview.

async fetchUserSchooling({ id_user }) {
  const [rows] = await db.query(
    `SELECT ii.schooling
     FROM initial_interview ii
     INNER JOIN user_relation ur ON ii.id_user_relation = ur.id_user_relation
     WHERE ur.id_user = ?
     LIMIT 1`,
    [id_user]
  );
  console.log('[fetchUserSchooling] id_user:', id_user, '| rows:', rows);
  return rows.length ? rows[0].schooling : null;
}

}

module.exports = impTestResultsRepository;
