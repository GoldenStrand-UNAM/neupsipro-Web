/**
 * Privileges dto
 */
class PrivilegesDTO {
  constructor ({ id_privilege, permited_action, permissions }) {
    this.idPrivilege = id_privilege,
    this.permittedAction = permited_action,
    this.permissions = permissions;
  }

  static fromEntity (entity) {
    return new PrivilegesDTO ({
      id_privilege: entity.id_privilege,
      permited_action: entity.permited_action,
      permissions: entity.permissions,
    });
  }
}

module.exports = PrivilegesDTO;
