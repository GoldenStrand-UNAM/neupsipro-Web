class tutorialRepository {
  async getByPage (_page) {
    throw new Error('getByPage() must be implemented');
  }
}

module.exports = tutorialRepository;
