class Intervention {
  constructor (data) {
    this.idIntervention = data.id_intervention;
    this.idUser = data.id_user;
    this.contractLink = data.contract_link;
    this.neuroProfile = data.neuro_profile;
    this.createdAt = data.created_at;

    this.userFullName = data.user_full_name || null;
    this.referenceNumber = data.reference_number || null;
    this.photo = data.profile_photo || null;
    this.schooling = data.schooling || null;
    this.ocupation = data.ocupation || null;

    this.sessions = [];
  }
}

class InterventionSession {
  constructor (data) {
    this.idSession = data.id_session;
    this.idIntervention = data.id_intervention;
    this.sessionNumber = data.session_number;
    this.sessionDate = data.session_date;
    this.objectives = data.objectives;
    this.development = data.development;
    this.dqpTask = data.dqp_task;
  }
}

module.exports = { Intervention, InterventionSession };
