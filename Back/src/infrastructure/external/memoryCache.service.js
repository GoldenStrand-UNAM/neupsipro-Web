class MemoryCacheService {
  constructor () {
    this.attempts = new Map();
  }

  getAttempts (username) {
    return this.attempts.get(username) || 0;
  }

  incrementAttempts (username) {
    const current = this.getAttempts(username);
    const newCount = current + 1;
    this.attempts.set(username, newCount);

    if (newCount === 4) {
      setTimeout(() => {
        this.clearAttempts(username);
      }, 15 * 60 * 1000);
    }

    return newCount;
  }

  clearAttempts (username) {
    this.attempts.delete(username);
  }
}

module.exports = MemoryCacheService;
