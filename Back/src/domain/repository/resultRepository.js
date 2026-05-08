// Interface contract for test result persistence.
class resultRepository {

  //Fetch all test results for a user
  async fetchUserTests({ id_user }) {
    throw new Error('fetchUserTests() not implemented');
  }

  async createResults (_id_application, _id_user, _tests) {
    throw new Error('createResults() must be implemented');
  }

  //Fetch all test results scoped to a specific application
  async fetchTestsByApplication({ id_user, id_application }) {
    throw new Error('fetchTestsByApplication() not implemented');
  }
}

module.exports = resultRepository;
