const Crypt = require('../crypt');

const crypt = new Crypt();

const decryptFullName = (encryptedFullName) => {
  if (!encryptedFullName) return null;
  const parts = encryptedFullName.split(' ');
  const decryptedParts = parts.map(part => crypt.decrypt(part));
  return decryptedParts.join(' ').trim();
};

function decryptIntervention (intervention) {
  return {
    ...intervention,
    userFullName: decryptFullName(intervention.userFullName),
    referenceNumber: crypt.decrypt(intervention.referenceNumber),
    contractLink: crypt.decrypt(intervention.contractLink),
    neuroProfile: crypt.decrypt(intervention.neuroProfile),

  };
}

function decryptInterventionSession (interventionSession) {
  return {
    ...interventionSession,
    objectives: crypt.decrypt(interventionSession.objectives),
    development: crypt.decrypt(interventionSession.development),
    dqpTask: crypt.decrypt(interventionSession.dqpTask),

  };
}

module.exports = { decryptIntervention, decryptInterventionSession };
