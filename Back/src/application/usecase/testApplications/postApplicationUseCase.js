const testApplicationDTO = require('../../dto/testApplicationDTO');

class postApplicationUseCase {
  constructor (impTestApplicationsRepository, impTestResultsRepository) {
    this.impTestApplicationsRepository = impTestApplicationsRepository;
    this.impTestResultsRepository      = impTestResultsRepository;
  }

  async execute ({ id_user, application_name }) {
    // 1. Verify user exists and retrieve their assigned protocol
    const userRecord = await this.impTestApplicationsRepository.fetchUserProtocol({ id_user });

    if (!userRecord) {
      const err  = new Error('User not found');
      err.status = 404;
      throw err;
    }

    const { protocol } = userRecord;

    // 2. Validate the user has a recognized protocol assigned
    if (!protocol || protocol === 'Pending') {
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

    // 4. Fetch the tests associated with the protocol
    const testIds = await this.impTestApplicationsRepository.fetchProtocolTests({ protocol });

    if (!testIds.length) {
      const err  = new Error(`No tests found for protocol: ${protocol}`);
      err.status = 422;
      throw err;
    }

    // 5. Persist the application — repository returns a full entity
    const savedEntity = await this.impTestApplicationsRepository.saveApplication({
      id_user,
      application_name,
    });

    // 6. Bulk-create the result rows for each test in the protocol
    await this.impTestResultsRepository.createResults(
      savedEntity.idApplication,
      id_user,
      testIds
    );

    // 7. Return DTO — never expose the raw entity across boundaries
    return new testApplicationDTO(savedEntity);
  }
}

module.exports = postApplicationUseCase;
