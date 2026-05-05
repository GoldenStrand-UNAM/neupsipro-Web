const db             = require('../../../infrastructure/database/database');
const testApplicationDTO = require('../../dto/testApplicationDTO');

// Research protocol requires: BANFE, WAIS, REY, Cuestionario
// Clinical protocol requires: MOCA, Cuestionario, NIH
const PROTOCOL_TESTS = {
  Research: [1, 2, 3, 5], 
  Clinical: [4, 5, 8],
};

class postApplicationUseCase {
  constructor (testApplicationsRepository, resultRepository) {
    this.testApplicationsRepository = testApplicationsRepository;
    this.resultRepository           = resultRepository;
  }

  async execute ({ id_user, application_name }) {
    // 1. Verify user exists and retrieve their assigned protocol
    const [userRows] = await db.query(
      `SELECT id_user, protocol FROM users WHERE id_user = ? AND eliminated = 0`,
      [id_user]
    );

    if (!userRows.length) {
      const err  = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const { protocol } = userRows[0];

    // 2. Validate the user has a recognized protocol assigned
    if (!protocol || !PROTOCOL_TESTS[protocol]) {
      const err  = new Error('User has no valid protocol assigned');
      err.status = 422;
      throw err;
    }

    // 3. Validate application_name before hitting the DB
    if (!application_name || !String(application_name).trim()) {
      const err  = new Error('application_name is required');
      err.status = 422;
      throw err;
    }
    if (String(application_name).trim().length > 20) {
      const err  = new Error('application_name must be 20 characters or less');
      err.status = 422;
      throw err;
    }

    // 4. Persist the application — repository returns a full entity
    const savedEntity = await this.testApplicationsRepository.saveApplication({
      id_user,
      application_name,
    });

    // 5. Bulk-create the result rows for each test in the protocol
    await this.resultRepository.createResults(
      savedEntity.idApplication,
      id_user,
      PROTOCOL_TESTS[protocol]
    );

    // 6. Return DTO — never expose the raw entity across boundaries
    return new testApplicationDTO(savedEntity);
  }
}

module.exports = postApplicationUseCase;