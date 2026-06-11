
const db = require ('../database/database');
const PermissionsRepository = require('../../domain/repository/PermissionsRepository');

class ImpPermissionsRepository extends PermissionsRepository {

  // Fetch all permissions by userId with module names
  async fetchAll ({ userId }) {
    const [rows] = await db.query(
      ` SELECT
            m.module,
            a.consultation,
            a.writing,
            a.edit,
            a.eliminate
        FROM user_acl AS a
        INNER JOIN modules AS m 
          ON a.id_module = m.id_module
        WHERE a.id_user = ?`,
      [userId]
    );

    return rows || null;
  }

  // Fetch contributors by relation
  async fetchPrivilegeNames () {
    const [rows] = await db.query(` SELECT p.permited_action, 
	            p.permissions
        FROM privilege_role AS pr
        INNER JOIN privilege AS p 
          ON p.id_privilege = pr.id_privilege
        WHERE pr.id_role = 3`);

    return rows;
  }

}

module.exports = ImpPermissionsRepository;
