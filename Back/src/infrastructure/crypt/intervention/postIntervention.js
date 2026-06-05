const Crypt = require('../crypt');

const crypt = new Crypt();

function cryptIntervention (intervention) {
  return {
    ...intervention,
    contractLink: crypt.encrypt(intervention.contract_link),
    neuroProfile: crypt.encrypt(intervention.neuro_profile),

  };
}

function cryptInterventionSession (interventionSession) {
  return {
    ...interventionSession,
    objectives: crypt.encrypt(interventionSession.objectives),
    development: crypt.encrypt(interventionSession.development),
    dqpTask: crypt.encrypt(interventionSession.dqp_task),

  };
}

module.exports = { cryptIntervention, cryptInterventionSession };
