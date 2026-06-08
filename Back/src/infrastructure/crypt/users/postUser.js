const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptUser (user) {
  const encrypted = encrypt(user);
  const data = `${user.firstName} ${user.lastnameP} ${user.lastnameM || ''} ${user.birthdate}
    `.replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  const bindex = crypt.generateBlindIndex(data);
  const refBindex = crypt.generateBlindIndex(user.referenceNumber);
  return {
    ...encrypted,
    userName: user.userName,
    idRole: user.idRole,
    assigned: user.assigned,
    passwordHash: user.passwordHash,
    profilePhoto: user.profilePhoto,
    bindex,
    refBindex,
  };
}

function encrypt (user) {
  return {
    firstName: crypt.encrypt(user.firstName),
    lastnameP: crypt.encrypt(user.lastnameP),
    lastnameM: crypt.encrypt(user.lastnameM),
    birthdate: crypt.encrypt(user.birthdate),
    phase: crypt.encrypt(user.phase),
    basePathology: crypt.encrypt(user.basePathology),
    modality: crypt.encrypt(user.modality),
    referenceNumber: crypt.encrypt(user.referenceNumber),
    laterality: crypt.encrypt(user.laterality),
    prosthetist: crypt.encrypt(user.prosthetist),
    neuroEntryDate: crypt.encrypt(user.neuroEntryDate),
    amputationDate: crypt.encrypt(user.amputationDate),
    amputationLevel: crypt.encrypt(user.amputationLevel),
    pairs: crypt.encrypt(user.pairs),
    sex: crypt.encrypt(user.sex),
    email: crypt.encrypt(user.email),
    phone: crypt.encrypt(user.phone),
  };
}

module.exports = cryptUser;
