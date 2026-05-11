class clinicalRepository {
  async fetchActivePatients ({ _search, _page, _limit }) {
    throw new Error('fetchActivePatients() must be implemented');
  }
  async countActivePatients ({ _search }) {
    throw new Error('countActivePatients() must be implemented');
  }
  async fetchAll () {
  throw new Error('fetchAll() must be implemented');
}
}
module.exports = clinicalRepository;
