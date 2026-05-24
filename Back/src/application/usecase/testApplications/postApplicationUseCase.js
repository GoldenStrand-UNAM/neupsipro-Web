const testApplicationDTO = require('../../dto/testApplicationDTO');

class postApplicationUseCase {
  constructor (impTestApplicationsRepository, impTestResultsRepository) {
    this.impTestApplicationsRepository = impTestApplicationsRepository;
    this.impTestResultsRepository      = impTestResultsRepository;
  }

  #validateInput (userRecord, application_name) {
    if (!userRecord) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    if (!userRecord.protocol || userRecord.protocol === 'Pending') {
      const err = new Error('User has no valid protocol assigned');
      err.status = 422;
      throw err;
    }
    const trimmed = String(application_name ?? '').trim();
    if (!trimmed) {
      const err = new Error('application_name is required');
      err.status = 422;
      throw err;
    }
    if (trimmed.length > 20) {
      const err = new Error('application_name must be 20 characters or less');
      err.status = 422;
      throw err;
    }
  }

  async execute ({ id_user, application_name }) {
    const userRecord = await this.impTestApplicationsRepository
      .fetchUserProtocol({ id_user });

    this.#validateInput(userRecord, application_name);

    // Enforce maximum of 5 applications per user
    const existingApps = await this.impTestApplicationsRepository
      .fetchTestApplications({ id_user });

    if (existingApps.length >= 5) {
      const err = new Error('User has reached the maximum of 5 applications');
      err.status = 422;
      throw err;
    }

    const { protocol } = userRecord;
    const tests = await this.impTestApplicationsRepository
      .fetchProtocolTests({ protocol });

    if (!tests.length) {
      const err = new Error(`No tests found for protocol: ${protocol}`);
      err.status = 422;
      throw err;
    }

    const savedEntity = await this.impTestApplicationsRepository.saveApplication({
      id_user,
      application_name,
    });

    const testIds = tests.map(t => t.id_test);
    await this.impTestResultsRepository.createResults(
      savedEntity.idApplication,
      id_user,
      testIds
    );

    return new testApplicationDTO(savedEntity);
  }
}

module.exports = postApplicationUseCase;