const testApplicationDTO = require('../../dto/testApplicationDTO');

// Fetches all application sessions for a given user
class GetApplicationsByUserUseCase {
  constructor (testApplicationsRepository) {
    this.testApplicationsRepository = testApplicationsRepository;
  }

  async execute ({ id_user }) {
    const sessions = await this.testApplicationsRepository.fetchTestSessions({ id_user });

    // Map entities → DTOs before leaving the use case boundary
    return sessions.map(s => new ApplicationDTO(s));
  }
}

module.exports = GetApplicationsByUserUseCase;