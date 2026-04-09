class MemoryCacheService {
    constructor () {
        this.attempts = new Map();
    }

    getAttempts (username) {
        return this.attempts.get(username) || 0;
    }

    incrementAttempts (username) {
        const current = this.getAttempts(username);
        this.attempts.set(username, current + 1);
        return current + 1;
    }

    clearAttempts (username) {
        this.attempts.delete(username);
    }

}

module.exports = MemoryCacheService;