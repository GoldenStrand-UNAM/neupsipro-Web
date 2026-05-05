// Interface contract for application persistence.
class applicationRepository {
  async saveApplication (_applicationEntity) {
    throw new Error('saveApplication() must be implemented');
  }

  async findByUser (_id_user) {
    throw new Error('findByUser() must be implemented');
  }
}

module.exports = applicationRepository;