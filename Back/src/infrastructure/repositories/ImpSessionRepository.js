const crypto = require ('crypto');

class ImpSessionRepository {
  constructor (dbConnection) {
    this.dbConnection = dbConnection;
  }

  async replaceActiveSessions (sessionData) {
    const { userId, ipAddress, userAgent, expiresAt } = sessionData;
    const idSession = crypto.randomUUID();
    const connection = await this.dbConnection.getConnection();
    try {
      await connection.beginTransaction();

      await connection.execute(
        'DELETE FROM sessions WHERE id_user = ? AND is_revoked = FALSE',
        [userId]
      );

      await connection.execute(`
            INSERT INTO sessions
            (id_session, id_user, ip_address, user_agent, expires_at, is_revoked, created_at, last_activity_at)
            VALUES (?, ?, ?, ?, ?, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [idSession, userId, ipAddress, userAgent, expiresAt]
      );

      await connection.commit();
      return idSession;

    } catch (error) {
      await connection.rollback();
      throw new Error('Error al crear la sesión en la base de datos', { cause: error });
    } finally {
      connection.release();
    }
  }
}
module.exports = ImpSessionRepository;
