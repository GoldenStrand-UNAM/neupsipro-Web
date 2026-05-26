class usersRepository {
  async fetchActivePatients ({ _search, _page, _limit }) {
    throw new Error('fetchActivePatients() must be implemented');
  }
  async countActivePatients ({ _search }) {
    throw new Error('countActivePatients() must be implemented');
  }
  async fetchOne ({ _id_user }) {
    throw new Error('fetchOne() must be implemented');
  }
  async softDeleteUser ({ _id_user }) {
    throw new Error('softDeleteUser() must be implemented');
  }
  async editUser (payload) {
    throw new Error('Must be implemented');
  }
  async fetchUserSnapshot ({ id_user }) {
    throw new Error('Must be implemented');
  }
  async editUserProtocol ({ _id_user, _protocol }) {
    throw new Error('editUserProtocol() must be implemented');
  }
}
module.exports = usersRepository;
