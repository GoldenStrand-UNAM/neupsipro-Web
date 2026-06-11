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
      permissions: permissionsData[0],
    });

    const exceptions = new Exceptions({
      exceptions: exceptionsData[0],
    });

    return {
      permissions,
      exceptions,
    };
  }
}

module.exports = PermissionsUseCase;
