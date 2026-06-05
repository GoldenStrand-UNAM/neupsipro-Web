const Crypt = require('../crypt');

const crypt = new Crypt();

class uncrypt {
  uncryptUser (birthdate) {
    return {
      birthdate: crypt.decrypt(birthdate),
    };
  }
}
module.exports = uncrypt;
