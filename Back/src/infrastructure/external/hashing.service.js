
const bcrypt = require('bcrypt');

class HashingService {
    compare (password, hash) {
        return bcrypt.compare(password, hash);
    }

    hash (password) {
        return bcrypt.hash(password, 12);
    }
}

module.exports = HashingService;