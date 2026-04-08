class AuthRepository {
    constructor (dbConnection) {
        this.db = dbConnection;
    }

    async findByUsername (username) {
        try {
            const rows = await this.db.execute('SELECT * FROM users WHERE user_name = ?', [username]);
            const user = rows[0];
            return user;
        } catch (error) {
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }

}

module.exports = AuthRepository;