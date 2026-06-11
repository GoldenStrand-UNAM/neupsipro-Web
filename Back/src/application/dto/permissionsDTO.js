class PermissionsDTO {
  static fromEntity (entity) {

    const groupedPermissions = {};

    entity.permissions.forEach(permission => {

      // Check if the group permissions exist
      if (!groupedPermissions[permission.permissions]) {
        groupedPermissions[permission.permissions] = [];
      }

      // Add the permission
      groupedPermissions[permission.permissions].push (permission.permited_action);
    });

    return {
      permissions: groupedPermissions,
    };
  }
}

module.exports = PermissionsDTO;
