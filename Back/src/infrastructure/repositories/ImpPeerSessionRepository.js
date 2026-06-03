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
}

module.exports = ImpPeerSessionRepository;