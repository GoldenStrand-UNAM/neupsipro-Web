const Crypt = require('../crypt');

const crypt = new Crypt();

function uncryptUser (user) {
  const ufirstName = crypt.decrypt(user.firstName);
  const uLastnameP = crypt.decrypt(user.lastNameP);
  const uLastnameM = crypt.decrypt(user.lastNameM);
  const fullName = `${ufirstName} ${uLastnameP} ${uLastnameM || ''}`.trim();

  return {
    ...user,
    referenceNumber: crypt.decrypt(user.referenceNumber),
    fullName,
  };
}

module.exports = uncryptUser;
