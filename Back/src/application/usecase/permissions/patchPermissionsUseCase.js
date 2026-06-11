const Permissions = require('../../../domain/entity/permissions');

class PermissionsUseCase {
  constructor (permissionsRepository) {
    this.permissionsRepository = permissionsRepository;
  }

  async execute ({ userId }) {

    // fetch all permissions for clinical user
    const info = await this.permissionsRepository.getInfo({ userId });
    const data = info[0];

    return new Permissions({ data });
  }
}

module.exports = PermissionsUseCase;
