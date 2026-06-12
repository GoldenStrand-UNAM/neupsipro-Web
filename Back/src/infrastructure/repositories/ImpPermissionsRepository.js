
const db = require ('../database/database');
const PermissionsRepository = require('../../domain/repository/PermissionsRepository');
const Uncrypt = require('../crypt/clinical/getClinicals');

const uncrypt = new Uncrypt();

class ImpPermissionsRepository extends PermissionsRepository {

  // ----------------------------------- GET -----------------------------------
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

  // ---------------------------------- PATCH ---------------------------------

  async fetchExceptions ({ userId, moduleName }) {
    const [rows] = await db.query(
      ` SELECT m.module, a.consultation, a.writing, a.edit, a.eliminate
        FROM user_acl AS a
        INNER JOIN modules AS m ON a.id_module = m.id_module
        WHERE a.id_user = ? AND m.module = ?`,
      [userId, moduleName]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async fetchIdModule ({ moduleName }) {
    const [rows] = await db.query(
      'SELECT id_module FROM modules WHERE module = ?',
      [moduleName]
    );
    return rows.length > 0 ? rows[0].id_module : null;
  }

  async updateException ({
    userId,
    moduleName,
    consultation,
    writing,
    edit,
    eliminate,
  }) {
    await db.query(
      `UPDATE user_acl AS a
       INNER JOIN modules AS m ON a.id_module = m.id_module
       SET a.consultation = ?, a.writing = ?, a.edit = ?, a.eliminate = ?
       WHERE a.id_user = ? AND m.module = ?`,
      [consultation, writing, edit, eliminate, userId, moduleName]
    );
  }

  // Inserts a new exception
  async insertException ({
    userId,
    idModule,
    consultation,
    writing,
    edit,
    eliminate,
  }) {
    await db.query(
      `INSERT INTO user_acl (id_user, id_module, consultation, writing, edit, eliminate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, idModule, consultation, writing, edit, eliminate]
    );
  }
}

module.exports = ImpPermissionsRepository;
