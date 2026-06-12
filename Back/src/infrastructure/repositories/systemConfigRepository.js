const db = require ('../database/database');

class SystemConfigRepository {

  // Fetch the current minimum salary config value
  async fetchMinSalary () {
    const [rows] = await db.query(
      `SELECT config_value, updated_at
            FROM system_config
            WHERE config_key = 'min_salary'`
    );

    return rows[0] || null;
  }

  // Update the minimum salary config value
  async updateMinSalary ({ value, updated_by }) {
    await db.query(
      `UPDATE system_config
      SET config_value = ?,
          updated_by = ?
      WHERE config_key = 'min_salary'`,
      [value, updated_by]
    );

    return await this.fetchMinSalary();
  }
}

module.exports = SystemConfigRepository;
