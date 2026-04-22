
const bcrypt = require('bcrypt');

class HashingService {
    async compare (password, hash) {
        return bcrypt.compare(password, hash);
    }

    async hash (password) {
        return await bcrypt.hash(password, 12);
    }
}

module.exports = HashingService;