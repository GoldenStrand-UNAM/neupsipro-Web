const db = require('../database/database');
const tutorialRepository = require('../../domain/repository/tutorialRepository');

class ImpTutorialRepository extends tutorialRepository {

  async getByPage (page) {
    const [rows] = await db.query(
      `SELECT step_order, title, content
       FROM tutorial
       WHERE page = ?
       ORDER BY step_order ASC`,
      [page]
    );
    return rows;
  }
}

module.exports = ImpTutorialRepository;
