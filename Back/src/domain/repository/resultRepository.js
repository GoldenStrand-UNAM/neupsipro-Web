// Interface contract for test result persistence.
class resultRepository {
  async createResults (_id_application, _id_user, _tests) {
    throw new Error('createResults() must be implemented');
  }
}

module.exports = resultRepository;