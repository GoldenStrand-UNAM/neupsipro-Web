
class ImpForumRepository {
    // Method to retrive one publication with its interactions. 
    async fetchOne () {
        throw new Error("fetchOne() publication in not working.");
    }

    async fetchOneUser () {
        throw new Error("fetchOneUser() publication in not working.");
    }

  // Method to retrieve paginated forum data (must be implemented)
  async fetchAll () {
    throw new Error('fetchAll() must be implemented');
  }
}
module.exports = ImpForumRepository;
