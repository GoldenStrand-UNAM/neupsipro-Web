const db = require('../database/database');
const PhysicalConcernsRepository = require('../../domain/repository/physicalConcernsRepository');

class ImpPhysicalConcernsRepository extends PhysicalConcernsRepository {
  async fetchPhysicalConcerns ({ idUserRelation }) {
    console.log(idUserRelation);
    const [rows] = await db.query(`
      SELECT headache, dizziness, urinary_inconsistency, skin_problem, id_user_relation
      FROM clinical_interview
      WHERE id_user_relation = ?;
    `, [idUserRelation]);
    console.log(rows);
    return rows[0];
  }
}

module.exports = ImpPhysicalConcernsRepository;