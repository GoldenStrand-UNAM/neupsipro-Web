
const db = require ('../database/database');
const PermissionsRepository = require('../../domain/repository/PermissionsRepository');
const Uncrypt = require('../crypt/clinical/getClinicals');

const uncrypt = new Uncrypt();

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
        FROM modules AS m 
        LEFT JOIN user_acl AS a 
            ON m.id_module = a.id_module AND a.id_user = ?`,
      [userId]
    );
    return rows || null;
  }

  async fetchName ({ userId }) {
    const [rows] = await db.query (`SELECT
      first_name,
      lastname_p,
      lastname_m
      FROM users 
      WHERE id_user = ?`, [userId]);
    const name = uncrypt.uncryptName(rows) || null;
    return name;
  }

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
