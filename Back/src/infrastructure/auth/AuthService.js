const AuthRepository = require("../../domain/Repository/AuthRepository");

class AuthService extends AuthRepository {
    constructor () {
        super();
        this.blacklist = new Set();
    }

    invalidateSession (token) {
        this.blacklist.add(token);
    }

    isBlacklisted (token) {
        return this.blacklist.has(token);
    }
}

module.exports = AuthService;