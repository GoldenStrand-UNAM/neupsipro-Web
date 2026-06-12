const Permissions = require('../../../domain/entity/permissions');
const Exceptions = require('../../../domain/entity/exceptions');
const Clinical = require('../../../domain/entity/clinical');

class PermissionsUseCase {
  constructor (permissionsRepository) {
    this.permissionsRepository = permissionsRepository;
  }

  async execute ({ userId }) {

    // fetch all permissions for clinical user
    const permissionsData = await this.permissionsRepository.fetchAll({ userId });
    const nameData = await this.permissionsRepository.fetchName({ userId });
    const exceptionsData = await this.permissionsRepository.fetchPrivilegeNames();

    const permissions = new Permissions({
      permissions: permissionsData,
    });

    const exceptions = new Exceptions({
      exceptions: exceptionsData,
    });

    const name = new Clinical(nameData);
    return {
      permissions,
      exceptions,
      name,
    };
  }
}

module.exports = PermissionsUseCase;
