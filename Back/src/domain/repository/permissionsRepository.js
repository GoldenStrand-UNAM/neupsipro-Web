class PermissionsRepository {

  // Fetch all permissions by userId with module names
  async fetchAll ({ userId: _userId }) {
    throw new Error('fetchAll() must be implemented');
  }

  // Fetch contributors by relation
  async fetchPrivilegeNames () {
    throw new Error('fetchPrivilegeNames() must be implemented');
  }

  // Fetch if permission record already exists
  async fetchExceptions ({
    userId: _userId,
    moduleName: _moduleName,
  }) {
    throw new Error('fetchExceptions() must be implemented');
  }

  // Fetch module id
  async fetchIdModule ({ moduleName: _moduleName }) {
    throw new Error('fetchIdModule() must be implemented');
  }

  // Update permissions by userid and module name
  async updateException ({
    userId: _userId,
    moduleName: _moduleName,
    consultation: _consultation,
    writing: _writing,
    edit: _edit,
    eliminate: _eliminate,
  }) {
    throw new Error('updateException() must be implemented');
  }

  // Insert permissions by userid and module id
  async insertException ({
    userId: _userId,
    idModule: _idModule,
    consultation: _consultation,
    writing: _writing,
    edit: _edit,
    eliminate: _eliminate,
  }) {
    throw new Error('insertException() must be implemented');
  }

}

module.exports = PermissionsRepository;
