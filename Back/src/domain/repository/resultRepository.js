// Interface contract for test result persistence.
class resultRepository {

  //Insert one result row per test linked to a session
  async createResults (_id_application, _id_user, _tests) {
    throw new Error('createResults() must be implemented');
  }

  //Fetch all test results scoped to a specific application
  async fetchTestsByApplication ({ _id_user, _id_application }) {
    throw new Error('fetchTestsByApplication() not implemented');
  }

  //Update an existing result row with score, interpretation, notes and status.
  async saveResult ({ _id_results, _score, _interpretation, _notes }) {
    throw new Error('saveResult() not implemented');
  }

  //Fetch a single result row to validate it exists before saving.
  async fetchResultRow ({ _id_user, _id_application, _id_test }) {
    throw new Error('fetchResultRow() not implemented');
  }

  // Fetch schooling level for a user from their initial interview.
  async fetchUserSchooling ({ _id_user }) {
    throw new Error('fetchUserSchooling() not implemented');
  }

  //Fetch age of user for REY test
  async fetchUserAge ({ _id_user }) {
    throw new Error('fetchUserAge() not implemented');
  }

}

module.exports = resultRepository;
