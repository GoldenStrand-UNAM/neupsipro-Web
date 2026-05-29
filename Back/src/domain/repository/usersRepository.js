class usersRepository {
  async fetchActivePatients ({ _search, _page, _limit }) {
    throw new Error('fetchActivePatients() must be implemented');
  }

  async countActivePatients ({ _search }) {
    throw new Error('countActivePatients() must be implemented');
  }

  async postUser ({
    _idRole,
    _userName,
    _firstName,
    _lastnameP,
    _lastnameM,
    _birthdate,
    _passwordHash,
    _assigned,
    _phase,
    _basePathology,
    _modality,
    _profilePhoto,
    _referenceNumber,
    _amputationDate,
    _amputationLevel,
    _laterality,
    _prosthetist,
    _neuroEntryDate,
    _pairs,
    _sex,
  }) {
    throw new Error('postUser() must be implemented');
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
