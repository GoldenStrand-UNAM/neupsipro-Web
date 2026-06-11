const Permissions = require('../../../domain/entity/permissions');
const Exceptions = require('../../../domain/entity/exceptions');

class PermissionsUseCase {
  constructor (permissionsRepository) {
    this.permissionsRepository = permissionsRepository;
  }

  async execute ({ userId }) {

    // fetch all permissions for clinical user
    const permissionsData = await this.permissionsRepository.fetchAll({ userId });

    const exceptionsData = await this.permissionsRepository.fetchPrivilegeNames();

    const permissions = new Permissions({
      permissions: permissionsData,
    });

    const exceptions = new Exceptions({
      exceptions: exceptionsData,
    });

    return {
      permissions,
      exceptions,
    };
  }
}

module.exports = PermissionsUseCase;
