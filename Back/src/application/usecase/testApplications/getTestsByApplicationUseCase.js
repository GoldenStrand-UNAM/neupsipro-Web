const TestsDTO = require('../../dto/testsDTO');

class getTestsByApplicationUseCase {

  // impTestResultsRepository owns everything related to test results and their session.
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // Returns all test results for a given session.
  async execute ({ id_user, id_application }) {

    // 1. Verify the session exists and belongs to the requesting user
    const application = await this.impTestResultsRepository
      .fetchApplicationById({ id_application });

    if (!application) {
      const err = new Error('Application not found');
      err.status = 404;
      throw err;
    }

    if (application.idUser !== id_user) {
      const err = new Error('Forbidden: this session does not belong to the user');
      err.status = 403;
      throw err;
    }

    // 2. Fetch all test results scoped to this session
    const tests = await this.impTestResultsRepository
      .fetchTestsByApplication({ id_user, id_application });

    // 3. Map entities to DTOs — never expose raw entities across boundaries
    return {
      applicationStatus: application.status,
      tests: tests.map(t => new TestsDTO(
        t.idTest,
        t.testName,
        t.idResults,
        t.status,
        t.dateApplied,
      )),
    };
  }
}

module.exports = getTestsByApplicationUseCase;
