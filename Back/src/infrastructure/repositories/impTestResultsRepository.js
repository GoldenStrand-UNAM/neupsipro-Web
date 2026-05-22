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
              tr.date_applied
              FROM test_results tr
       JOIN psych_tests pt ON tr.id_test = pt.id_test
       WHERE tr.id_user        = ?
         AND tr.id_application = ?`,
      [id_user, id_application]
    );
    return rows.map(row => new Tests(row));
  }

  // Insert one result row per test in the resolved protocol.
  async createResults (id_application, id_user, tests) {
    if (!tests || tests.length === 0) return [];

    const placeholders = tests.map(() => '(?, ?, ?, ?, 1)').join(', ');
    const values       = tests.flatMap(id_test => [uuidv4(), id_user, id_application, id_test]);

    const [result] = await db.query(
      `INSERT INTO test_results (id_results, id_user, id_application, id_test, status)
      VALUES ${placeholders}`,
      values
    );

    return result;
  }

  // Looks up the test_results row for a given user + application + test.
  async fetchResultRow ({ id_user, id_application, id_test }) {
    const [rows] = await db.query(
      `SELECT id_results, status
        FROM test_results
        WHERE id_user       = ?
          AND id_application = ?
          AND id_test        = ?
        LIMIT 1`,
      [id_user, id_application, id_test]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      idResults: row.id_results,
      status: row.status,
    };
  }

  //============ STATUS =================================

  // Fetch all test statuses for an application — used to check if all are graded.
  async fetchTestStatusByApplication ({ id_application }) {
    const [rows] = await db.query(
      `SELECT status
      FROM test_results
      WHERE id_application = ?`,
      [id_application]
    );
    return rows.map(r => r.status);
  }

  // Set status 5 (Caducada) on all incomplete tests within an application.
  // Tests already graded (status 3) are preserved.
  async expireIncompleteTests ({ id_application }) {
    await db.query(
      `UPDATE test_results
      SET status = 5
      WHERE id_application = ?
        AND status != 3`,
      [id_application]
    );
  }

  // Fetch status and date_applied for all tests in an application.
  // Used by checkExpiryUseCase to evaluate per-test expiry.
  async fetchTestsWithDateByApplication ({ id_application }) {
    const [rows] = await db.query(
      `SELECT status, date_applied
      FROM test_results
      WHERE id_application = ?`,
      [id_application]
    );
    return rows.map(r => ({
      status: r.status,
      date_applied: r.date_applied ?? null,
    }));
  }


}

module.exports = impTestResultsRepository;