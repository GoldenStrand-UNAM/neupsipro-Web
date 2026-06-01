const Crypt = require('../crypt');

const crypt = new Crypt();

const decryptBirthdate = (encryptedBirthdate) => {
  if (!encryptedBirthdate) return null;
  const decryptedBirthdate = crypt.decrypt(encryptedBirthdate);
  return decryptedBirthdate;
};

const decryptGender = (entity) => {
  if (!entity.gender || entity.gender === 'Not specified') {
    return entity;
  }
  // eslint-disable-next-line no-param-reassign
  entity.gender = crypt.decrypt(entity.gender);
  return entity;
};

const decryptRefNum = (encryptedRefNum) => {
  if (!encryptedRefNum) return null;
  const decryptedRefNum = crypt.decrypt(encryptedRefNum);
  return decryptedRefNum;
};

const decryptFullName = (encryptedFullName) => {
  if (!encryptedFullName) return null;
  const parts = encryptedFullName.split(' ');
  const decryptedParts = parts.map(part => crypt.decrypt(part));
  return decryptedParts.join(' ').trim();
};

function decryptDetail (detailEntry) {
  return {
    ...detailEntry,
    fullName: decryptFullName(detailEntry.fullName),
    referenceNumber: decryptRefNum(detailEntry.referenceNumber),
    birthdate: decryptBirthdate(detailEntry.birthdate),
    neuroEntryDate: crypt.decrypt(detailEntry.neuroEntryDate),
    amputationDate: crypt.decrypt(detailEntry.amputationDate),
    assignedClinics: Array.isArray(detailEntry.assignedClinics)
      ? detailEntry.assignedClinics.map(clinic => decryptFullName(clinic))
      : []  };
}

module.exports = { decryptBirthdate,  decryptGender, decryptRefNum, decryptDetail  };
