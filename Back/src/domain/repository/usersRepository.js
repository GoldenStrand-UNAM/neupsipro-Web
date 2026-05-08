class usersRepository {
  async fetchActivePatients ({ _search, _page, _limit }) {
    throw new Error('fetchActivePatients() must be implemented');
  }
  async countActivePatients ({ _search }) {
    throw new Error('countActivePatients() must be implemented');
  }
  async fetchNumberUsers () {
    throw new Error('fetchNumberUsers() is not working/implemented');
  }
  async fetchAllWithClinical () {
    throw new Error('fetchAllWithClinical() is not working/implemented');
  }
}
module.exports = usersRepository;
