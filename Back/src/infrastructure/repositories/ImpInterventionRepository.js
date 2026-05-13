const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');
const interventionRepository = require('../../domain/repository/interventionRepository');
const { Intervention, InterventionSession } = require('../../domain/entity/Intervention');

class ImpInterventionRepository extends interventionRepository {

  // Returns active intervention with user info (or null)
  async findByUser ({ id_user }) {
    const [rows] = await db.query(
      `SELECT 
          i.id_intervention,
          i.id_user,
          i.contract_link,
          i.neuro_profile,
          i.created_at,
          CONCAT_WS(' ', u.first_name, u.lastname_p, u.lastname_m) AS user_full_name,
          u.profile_photo,
          ui.reference_number,
          ii.schooling,
          ii.ocupation
       FROM intervention i
       JOIN users u ON i.id_user = u.id_user
       LEFT JOIN user_info ui ON ui.id_user = u.id_user
       LEFT JOIN user_relation ur ON ur.id_user = u.id_user AND ur.type = 'initial_interview'
       LEFT JOIN initial_interview ii ON ii.id_user_relation = ur.id_user_relation
       WHERE i.id_user = ?
       LIMIT 1`,
      [id_user]
    );
    return rows.length ? new Intervention(rows[0]) : null;
  }

  // Creates a new empty intervention
  async createIntervention ({ id_user }) {
    const idIntervention = uuidv4();
    await db.query(
      'INSERT INTO intervention (id_intervention, id_user) VALUES (?, ?)',
      [idIntervention, id_user]
    );
    return idIntervention;
  }

  // Updates contract link and/or neuro profile
  async updateContract ({ id_user, contract_link, neuro_profile }) {
    const [result] = await db.query(
      `UPDATE intervention 
       SET contract_link = ?, neuro_profile = ? 
       WHERE id_user = ?`,
      [contract_link, neuro_profile, id_user]
    );
    return result.affectedRows > 0;
  }

  // Returns all sessions of an intervention id
  async findSessionsByIntervention ({ id_intervention }) {
    const [rows] = await db.query(
      `SELECT id_session, id_intervention, session_number, session_date,
                objectives, development, dqp_task
        FROM intervention_session
        WHERE id_intervention = ?
        ORDER BY session_date ASC, id_session ASC`,
      [id_intervention]
    );
    return rows.map(r => new InterventionSession(r));
  }

  // Returns last session of an intervention id
  async findLastSession ({ id_intervention }) {
    const [rows] = await db.query(
      `SELECT id_session, id_intervention, session_number, session_date,
                objectives, development, dqp_task
        FROM intervention_session
        WHERE id_intervention = ?
        ORDER BY session_date DESC, id_session DESC
        LIMIT 1`,
      [id_intervention]
    );
    return rows.length ? new InterventionSession(rows[0]) : null;
  }

  // New session
  async createSession ({ id_intervention, session_number, session_date, objectives, development, dqp_task }) {
    const idSession = uuidv4();
    await db.query(
      `INSERT INTO intervention_session 
         (id_session, id_intervention, session_number, session_date, objectives, development, dqp_task)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [idSession, id_intervention, session_number, session_date, objectives, development, dqp_task]
    );
    return idSession;
  }
  // delte session with their id
  async deleteSession ({ id_session }) {
    const [result] = await db.query(
      'DELETE FROM intervention_session WHERE id_session = ?',
      [id_session]
    );
    return result.affectedRows > 0;
  }
}

module.exports = ImpInterventionRepository;
