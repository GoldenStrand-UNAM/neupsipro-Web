class interactionRepository {
  // Method to retrive one publication with its interactions.
  async fetchAllFromOne () {
    throw new Error('fetchAllFromOne() interaction is not working.');
  }
  // Method to retrive the number of likes.
  async fetchLikes () {
    throw new Error('fetchLikes() interacrion is not working.');
  }
  // Method to retrive the number of comments.
  async fetchComments () {
    throw new Error('fetchComments() interaction is not working.');
  }
  async deleteAllFromPublication ({ _idPublication }) {
    throw new Error('deleteAllFromPublication() must be implemented');
  }
}
module.exports = interactionRepository;
