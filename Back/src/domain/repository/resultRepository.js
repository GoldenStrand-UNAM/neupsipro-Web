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

  //=================== STATUS =============================

  // Fetch all test statuses for an application
  async fetchTestStatusByApplication ({ _id_application }) {
    throw new Error('fetchTestStatusByApplication() not implemented');
  }

  // Expire all incomplete tests within an application
  async expireIncompleteTests ({ _id_application }) {
    throw new Error('expireIncompleteTests() not implemented');
  }

  // Fetch status and date_applied for all tests in an application
  async fetchTestsWithDateByApplication ({ _id_application }) {
    throw new Error('fetchTestsWithDateByApplication() not implemented');
  }

}

module.exports = resultRepository;
