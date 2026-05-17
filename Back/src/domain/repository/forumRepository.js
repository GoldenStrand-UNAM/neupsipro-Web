
class forumRepository {

  // Method to retrieve paginated forum data (must be implemented)
  async fetchAll () {
    throw new Error('fetchAll() must be implemented');
  }
  // Method to save a new publication
  async save ({ _id_usuario, _titulo, _contenido, _imagenes }) {
    throw new Error('save() must be implemented');
  }

  async fetchOne () {
    throw new Error('fetchOne() publication in not working.');
  }

  async fetchOneUser () {
    throw new Error('fetchOneUser() publication in not working.');
  }

  async findById ({ _idPublication }) {
    throw new Error('findById() must be implemented');
  }
  async deletePublication ({ _idPublication }) {
    throw new Error('deletePublication() must be implemented');
  }
}

module.exports = forumRepository;
