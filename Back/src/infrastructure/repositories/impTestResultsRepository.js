const db = require ('../database/database');
const Tests = require('../../domain/entity/tests');
const resultRepository = require('../../domain/repository/resultRepository');
const { v4: uuidv4 } = require('uuid');


class impTestResultsRepository extends resultRepository {
  async fetchUserTests ({ id_user }) {
    const [tests] = await db.query(
      `SELECT *
      FROM test_results tr
      JOIN psych_tests pt ON tr.id_test = pt.id_test
      WHERE tr.id_user = ?`,
      [id_user]
    );
    return tests.map(row => new Tests(row));
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

}

module.exports = impTestResultsRepository;
