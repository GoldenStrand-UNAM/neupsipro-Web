
class forumRepository {

  // Method to retrieve paginated forum data (must be implemented)
  async fetchAll () {
    throw new Error('fetchAll() must be implemented');
  }
  // Method to save a new publication
  async save ({ _id_usuario, _titulo, _contenido, _imagenes }) {
    throw new Error('save() must be implemented');
  }
}

module.exports = forumRepository;
