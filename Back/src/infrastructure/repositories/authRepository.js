class AuthRepository {
    constructor (dbConnection) {
        this.db = dbConnection;
    }

    async findByUsername (username) {
        try {
            const [rows] = await this.db.execute('SELECT * FROM users WHERE user_name = ?', [username]);

            if (rows.length === 0) {
                return null;
            }

            const user = rows[0];
            return user;
        } catch (error) {
            console.log(error);
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }

    /*async getByUserId (idUser) {
        try {
            const [rows] = await this.db.execute('', [idUser]);
            if (rows.length === 0) {
                return null;
            }
        } catch (error) {
            console.log(error);
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }
*/

    async invalidateSession(token) {
        // logica de borrado de token de la DB
        try {
            await this.db.execute('DELETE FROM sessions WHERE token = ?', [token]);
            return true;
        } catch (error) {
            console.log(error);
            throw new Error('Error al invalidar sesión');
        }
    }
}

module.exports = AuthRepository;