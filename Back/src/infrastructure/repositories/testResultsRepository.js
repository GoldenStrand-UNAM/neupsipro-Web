const db = require ('../database/database');
const Tests = require('../../domain/entity/tests');

class TestResultsRepository {
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
}

module.exports = TestResultsRepository;
