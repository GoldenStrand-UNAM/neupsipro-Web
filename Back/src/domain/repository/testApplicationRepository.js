// Interface contract for application persistence.
class testApplicationRepository {
  async saveApplication (_applicationData) {
    throw new Error('saveApplication() must be implemented');
  }

  async fetchTestSessions ({ _id_user }) {
    throw new Error('fetchTestSessions() must be implemented');
  }
}

module.exports = testApplicationRepository;