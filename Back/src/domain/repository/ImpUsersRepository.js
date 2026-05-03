class ImpUsersRepository {
  async fetchActivePatients ({ _search, _page, _limit }) {
    throw new Error('fetchActivePatients() must be implemented');
  }
  async countActivePatients ({ _search }) {
    throw new Error('countActivePatients() must be implemented');
  }
        // Method to retrive the user profile of a publication. 
    async fetchUserPublication () {
        throw new Error("fetchUserPublication is not working.");
    }

    // Method to retrieve the user of an interaction. 
    async fecthUserInteraction () {
        throw new Error("fechUserInteraction is not working")
    }
}
module.exports = ImpUsersRepository;
