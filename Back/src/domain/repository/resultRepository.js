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
}

module.exports = resultRepository;
