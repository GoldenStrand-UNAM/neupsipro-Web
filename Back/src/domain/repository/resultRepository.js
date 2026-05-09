// Interface contract for test result persistence.
class resultRepository {

  //Insert one result row per test linked to a session
  async createResults (_id_application, _id_user, _tests) {
    throw new Error('createResults() must be implemented');
  }

  //Fetch all test results scoped to a specific application
  async fetchTestsByApplication ({ id_user, id_application }) {
    throw new Error('fetchTestsByApplication() not implemented');
  }

  //Fetch a single result row to validate it exists before saving.
  async fetchResultRow({ id_user, id_application, id_test }) {
  throw new Error('fetchResultRow() not implemented');
  }

  //Update an existing result row with score, interpretation, notes and status.
  async saveResult({ id_results, score, interpretation, notes }) {
  throw new Error('saveResult() not implemented');
  }
}

module.exports = resultRepository;
