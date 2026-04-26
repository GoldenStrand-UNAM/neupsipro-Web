const crypto = require ('crypto');

class SessionRepository {
    constructor (dbConnection) {
        this.dbConnection = dbConnection;
    }

    async createSession (sessionData) {
        const {userId, ipAddress, userAgent, expiresAt} = sessionData;
        const idSession = crypto.randomUUID();
        try {
            const query = `
            INSERT INTO sessions 
            (id_session, id_user, ip_address, user_agent, expires_at, is_revoked, created_at, last_activity_at)
            VALUES (?, ?, ?, ?, ?, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
             await this.dbConnection.execute(query, [
                idSession,
                userId,
                ipAddress,
                userAgent,
                expiresAt,
            ]);

            return idSession;

        } catch (error) {
            throw new Error('Error al crear la sesión en la base de datos: ', { cause: error });
        }
    }
}
module.exports = SessionRepository;