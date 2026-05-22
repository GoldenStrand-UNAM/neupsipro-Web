const TestsDTO = require('../../dto/testsDTO');

const APPLICATION_STATUS_LABEL = {
  1: 'Por comenzar',
  2: 'En proceso',
  3: 'Calificada',
  4: 'Entregado',
  5: 'Caducada',
};

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
      applicationStatus: APPLICATION_STATUS_LABEL[application.status] ?? String(application.status),
      tests: tests.map(t => new TestsDTO(
        t.idTest,
        t.testName,
        t.idResults,
        t.status,
        t.dateApplied
      )),
    };
  }
}

module.exports = getTestsByApplicationUseCase;