class PermissionsRepository {

  // Fetch all permissions by userId with module names
  async fetchAll ({ userId: _userId }) {
    throw new Error('fetchAll() must be implemented');
  }

  // Fetch contributors by relation
  async fetchPrivilegeNames () {
    throw new Error('fetchPrivilegeNames() must be implemented');
  }

}

module.exports = PermissionsRepository;
