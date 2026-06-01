const testApplicationDTO = require('../../dto/testApplicationDTO');

// Fetches all application sessions for a given user
class GetApplicationsByUserUseCase {
  constructor (impTestApplicationsRepository) {
    this.impTestApplicationsRepository = impTestApplicationsRepository;
  }

  async execute ({ id_user }) {
    const sessions = await this.impTestApplicationsRepository.fetchTestSessions({ id_user });

    // Map entities → DTOs before leaving the use case boundary
    return sessions.map(s => new testApplicationDTO(s));
  }
}

module.exports = GetApplicationsByUserUseCase;
