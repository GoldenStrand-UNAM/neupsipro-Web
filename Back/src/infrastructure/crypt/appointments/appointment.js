const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  const ufirstName = crypt.decrypt(user.first_name);
  const uLastnameP = crypt.decrypt(user.lastname_p);
  const uLastnameM = crypt.decrypt(user.lastname_m);
  const fullName = `${ufirstName} ${uLastnameP} ${uLastnameM || ''}`.trim();

  return {
    ...user,
    full_name: fullName
  };
}

module.exports = uncryptUser;