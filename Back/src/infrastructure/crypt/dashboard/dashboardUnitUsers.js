const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  return {
    ...user,
    reference_number: crypt.decrypt(user.reference_number),
  };
}

module.exports = uncryptUser;
