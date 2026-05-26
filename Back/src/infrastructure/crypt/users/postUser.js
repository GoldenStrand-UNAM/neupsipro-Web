const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptUser (user) {
  const first = encryptFirst(user);
  const second = encryptSecond(user);
  const third = encryptThird(user);

  return {
    ...first,
    ...second,
    ...third,
    idRole: user.idRole,
    assigned: user.assigned,
    passwordHash: user.passwordHash,
    profilePhoto: user.profilePhoto,
  };
}

function encryptFirst (user) {
  const eUserName = crypt.encrypt(user.userName);
  const eFirstName = crypt.encrypt(user.firstName);
  const eLastnameP = crypt.encrypt(user.lastnameP);
  const eLastnameM = crypt.encrypt(user.lastnameM);
  const eBirthdate = crypt.encrypt(user.birthdate);

  return {
    userName: eUserName,
    firstName: eFirstName,
    lastnameP: eLastnameP,
    lastnameM: eLastnameM,
    birthdate: eBirthdate,
  };
}

function encryptSecond (user) {
  const ePhase = crypt.encrypt(user.phase);
  const eBasePathology = crypt.encrypt(user.basePathology);
  const eModality = crypt.encrypt(user.modality);
  const eReferenceNumber = crypt.encrypt(user.referenceNumber);
  const eLaterality = crypt.encrypt(user.laterality);

  return {
    phase: ePhase,
    basePathology: eBasePathology,
    modality: eModality,
    referenceNumber: eReferenceNumber,
    laterality: eLaterality,
  };
}

function encryptThird (user) {
  const eProsthetist = crypt.encrypt(user.prosthetist);
  const eNeuroEntryDate = crypt.encrypt(user.neuroEntryDate);
  const eAmputationDate = crypt.encrypt(user.amputationDate);
  const eAmputationLevel = crypt.encrypt(user.amputationLevel);
  const ePairs = crypt.encrypt(user.pairs);
  const eSex = crypt.encrypt(user.sex);

  return {
    prosthetist: eProsthetist,
    neuroEntryDate: eNeuroEntryDate,
    amputationDate: eAmputationDate,
    amputationLevel: eAmputationLevel,
    pairs: ePairs,
    sex: eSex,
  };
}

module.exports = cryptUser;
