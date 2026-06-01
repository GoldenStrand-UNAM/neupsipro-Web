const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptUser (user) {
  const encrypted = encrypt(user);

  return {
    ...encrypted,
    userName: user.userName,
    idRole: user.idRole,
    assigned: user.assigned,
    passwordHash: user.passwordHash,
    profilePhoto: user.profilePhoto,
  };
}

function encrypt (user) {;
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
  };
}

module.exports = cryptUser;
