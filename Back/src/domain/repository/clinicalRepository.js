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
  async fetchClinicalUsers () {
    throw new Error('fetchClinicalUsers() is not working/implemented');
  }
  async postUser () {
    throw new Error('postUser() is must be implemented');
  }
  async fetchClinicalForEdit () {
    throw new Error('fetchClinicalForEdit() must be implemented');
  }
  async updateUser () {
    throw new Error('updateUser() must be implemented');
  }
  async softDeleteUser () {
    throw new Error('softDeleteUser() is must be implemented');
  }

}
module.exports = clinicalRepository;
