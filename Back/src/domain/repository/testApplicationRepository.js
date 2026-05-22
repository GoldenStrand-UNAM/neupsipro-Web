// Interface contract for application persistence.
class testApplicationRepository {
  async saveApplication (_applicationData) {
    throw new Error('saveApplication() must be implemented');
  }

  async fetchTestSessions ({ _id_user }) {
    throw new Error('fetchTestSessions() must be implemented');
  }

  /**
   * Returns { id_user, protocol } for the given user,
   * or null if the user does not exist / is eliminated.
   */
  async fetchUserProtocol ({ _id_user }) {
    throw new Error('fetchUserProtocol() must be implemented');
  }

  /**
   * Returns an array of id_test values for the given protocol.
   * Returns [] if the protocol has no tests registered.
   */
  async fetchProtocolTests ({ _protocol }) {
    throw new Error('fetchProtocolTests() must be implemented');
  }

  // Fetch all active applications for a user — excludes completed (3) and expired (5)
  async fetchActiveApplicationsByUser ({ _id_user }) {
    throw new Error('fetchActiveApplicationsByUser() not implemented');
  }

  // Update application status
  async updateApplicationStatus ({ _id_application, _status }) {
    throw new Error('updateApplicationStatus() not implemented');
  }
}

module.exports = testApplicationRepository;