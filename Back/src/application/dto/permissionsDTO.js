class PermissionsDTO {
  static fromEntity (entity) {

    const groupedPermissions = {};

    entity.permissions.forEach(permission => {

      // Add the permission
      groupedPermissions[permission.module] = {
        consultation: permission.consultation,
        writing: permission.writing,
        edit: permission.edit,
        eliminate: permission.eliminate,
      };

    });

    return groupedPermissions;
  }
}

module.exports = PermissionsDTO;
