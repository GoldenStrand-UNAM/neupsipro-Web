const db = require('../database/database');
const peerSessionRepository = require('../../domain/repository/peerSessionRepository');
const { v4: uuidv4 } = require('uuid');

class ImpPeerSessionRepository extends peerSessionRepository {
  async postSession (session) {
    const idPeerSession = uuidv4();

    await db.query(
      `INSERT INTO peer_session
        (id_peer_session, title, responsable, note, session_date, men_count, women_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        idPeerSession,
        session.title,
        session.responsable,
        session.note,
        session.date,
        session.men_count,
        session.women_count,
      ]
    );

    const [rows] = await db.query(
      `SELECT id_peer_session, title, responsable, note, session_date, men_count, women_count
         FROM peer_session
        WHERE id_peer_session = ?`,
      [idPeerSession]
    );

    return rows[0];
  }

  async fetchAllForStats () {
    const [rows] = await db.query(
      `SELECT title, session_date, men_count, women_count
         FROM peer_session
        ORDER BY session_date ASC`
    );
    return rows;
  }
  
  async deleteSession (id_peer_session) {
      const [result] = await db.query(
        `DELETE FROM peer_session
          WHERE id_peer_session = ?`,
        [id_peer_session]
      );
      return result.affectedRows > 0;
    }

  async fetchSessions ({ page, limit, from, to }) {
    const offset = (page - 1) * limit;
    const fromParam = from || null;
    const toParam = to || null;

    const [rows] = await db.query(
      `SELECT id_peer_session,
              title,
              responsable,
              note,
              DATE_FORMAT(session_date, '%Y-%m-%d') AS session_date,
              men_count,
              women_count
         FROM peer_session
        WHERE (? IS NULL OR session_date >= ?)
          AND (? IS NULL OR session_date <= ?)
        ORDER BY session_date DESC
        LIMIT ? OFFSET ?`,
      [fromParam, fromParam, toParam, toParam, Number(limit), Number(offset)]
    );
    return rows;
  }

  async countSessions ({ from, to }) {
    const fromParam = from || null;
    const toParam = to || null;

    const [rows] = await db.query(
      `SELECT COUNT(*) AS total
         FROM peer_session
        WHERE (? IS NULL OR session_date >= ?)
          AND (? IS NULL OR session_date <= ?)`,
      [fromParam, fromParam, toParam, toParam]
    );
    return rows[0]?.total ?? 0;
  }
  
}

module.exports = ImpPeerSessionRepository;