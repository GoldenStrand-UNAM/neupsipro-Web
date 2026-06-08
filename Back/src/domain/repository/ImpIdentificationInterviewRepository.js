class ImpIdentificationInterviewRepository {

  // Fetch relation by id
  async fetchRelation ({ id_user: _id_user }) {
    throw new Error('fetchRelation() must be implemented');
  }

  // Fetch interview progress by relation
  async fetchInterviewProgress ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchInterviewProgress() must be implemented');
  }

  // Fetch read-only patient fields by user
  async fetchReadOnlyFields ({ id_user: _id_user }) {
    throw new Error('fetchReadOnlyFields() must be implemented');
  }

  // Fetch Datos Personales by relation
  async fetchSubStep1Data ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchSubStep1Data() must be implemented');
  }
}

module.exports = ImpIdentificationInterviewRepository;
