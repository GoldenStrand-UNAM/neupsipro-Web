const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptUser (user) {
  const data = `${user.firstName} ${user.lastnameP} ${user.lastnameM || ""} ${user.birthdate}
    `.replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const bindex = crypt.generateBlindIndex(data);
  return {
    ...user,
    firstName: crypt.encrypt(user.firstName),
    lastnameP: crypt.encrypt(user.lastnameP),
    lastnameM: crypt.encrypt(user.lastnameM),
    birthdate: crypt.encrypt(user.birthdate),
    email: crypt.encrypt(user.email),
    affiliation: crypt.encrypt(user.affiliation),
    activity: crypt.encrypt(user.activity),
    startDate: crypt.encrypt(user.startDate),
    finishDate: crypt.encrypt(user.finishDate),
    emergencyContactName: crypt.encrypt(user.emergencyContactName),
    emergencyContactPhone: crypt.encrypt(user.emergencyContactPhone),
    emergencyContactRelation: crypt.encrypt(user.emergencyContactRelation),
    bindex: bindex,
  };
}

module.exports = cryptUser;
