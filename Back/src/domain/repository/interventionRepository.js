class interventionRepository {
  async findByUser ({ _id_user }) {
    throw new Error('findByUser() must be implemented');
  }
  async createIntervention ({ _id_user, _contract_link }) {
    throw new Error('createIntervention() must be implemented');
  }
  async findSessionsByIntervention ({ _id_intervention }) {
    throw new Error('findSessionsByIntervention() must be implemented');
  }
  async findLastSession ({ _id_intervention }) {
    throw new Error('findLastSession() must be implemented');
  }
  async createSession ({ _id_intervention, _session_number, _session_date, _objectives, _development, _dqp_task }) {
    throw new Error('createSession() must be implemented');
  }
  async deleteSession ({ _id_session }) {
    throw new Error('deleteSession() must be implemented');
  }
}
module.exports = interventionRepository;