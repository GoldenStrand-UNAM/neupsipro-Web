const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  return {
    ...user,
    id_user: user.id_user,
    first_name: crypt.decrypt(user.first_name),
    lastname_p: crypt.decrypt(user.lastname_p),
    lastname_m: crypt.decrypt(user.lastname_m),
  };
}

module.exports = uncryptUser;
