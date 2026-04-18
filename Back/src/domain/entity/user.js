class User {
    constructor ({ idUser, idRole, eliminated, passwordHash }) {
        this.idUser = idUser;
        this.idRole = idRole;
        this.eliminated = eliminated;
        this.passwordHash = passwordHash;
    }

    checkIfActive () {
        if (this.eliminated) {
            throw new Error('Esta cuenta ha sido desactivada');
        }
    }
}
module.exports = User