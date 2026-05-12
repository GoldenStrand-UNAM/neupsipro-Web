class interventionRepository {
  async findByUser ({ _id_user }) {
    throw new Error('findByUser() must be implemented');
  }
  async createIntervention ({ _id_user, _neuropsych_profile, _contract_link }) {
    throw new Error('createIntervention() must be implemented');
  }
  async deleteByUser ({ _id_user }) {
    throw new Error('deleteByUser() must be implemented');
  }
}
module.exports = interventionRepository;