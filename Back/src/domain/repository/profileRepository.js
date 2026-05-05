/**
 * Interface of profile repository.
 * Defines the operations from the infraestructure layer must implement.
 */
class profileRepository {
  async getUserId (_userId) {
    throw new Error("Method 'getUserId()' must be implemented.");
  }
}

module.exports = profileRepository;
