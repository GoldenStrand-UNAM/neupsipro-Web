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
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }

    async getPrivileges (idUser) {
        try {
            const [rows] = await this.db.execute(`
                SELECT p.permited_action, p.permissions
                FROM users u
                JOIN roles r ON u.id_role = r.id_role
                JOIN privilege_role pr ON r.id_role = pr.id_role
                JOIN privilege p ON pr.id_privilege = p.id_privilege
                WHERE u.id_user = ?;`, [idUser]);
            if (rows.length === 0) {
                return null;
            }

            return rows;

        } catch (error) {
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }

    //function to get acls
    async getExceptions (idUser) {
        try {
            const [rows] = await this.db.execute(`
                SELECT m.module AS module_name, acl.consultation, acl.writting, acl.edit, acl.eliminate
                FROM access_role ar
                JOIN acl ON ar.id_acl = acl.id_acl
                JOIN acl_modules am ON acl.id_acl = am.id_acl
                JOIN modules m ON am.id_module = m.id_module
                WHERE ar.id_user = ?;`, [idUser]);
            
            if (rows.length === 0) {
                return null;
            }

            return rows;

        } catch (error) {
            throw new Error ('Error al consultar base de datos', {cause: error});
        }
    }



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