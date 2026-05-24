const testApplicationDTO = require('../../dto/testApplicationDTO');

class postApplicationUseCase {
  constructor (impTestApplicationsRepository, impTestResultsRepository) {
    this.impTestApplicationsRepository = impTestApplicationsRepository;
    this.impTestResultsRepository      = impTestResultsRepository;
  }

<<<<<<< HEAD
  #validateInput (userRecord, application_name) {
=======
  async execute ({ id_user, application_name }) {
    // 1. Verify user exists and retrieve their assigned protocol
    const userRecord = await this.impTestApplicationsRepository.fetchUserProtocol({ id_user });

>>>>>>> 5efc3a6b5efb4b1d33d413406e64f47b944a037f
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
    const userRecord = await this.impTestApplicationsRepository.fetchUserProtocol({ id_user });
    this.#validateInput(userRecord, application_name);

    const { protocol } = userRecord;
    const tests = await this.impTestApplicationsRepository.fetchProtocolTests({ protocol });

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
    await this.impTestResultsRepository.createResults(savedEntity.idApplication, id_user, testIds);

    return new testApplicationDTO(savedEntity);
  }
}

module.exports = postApplicationUseCase;
