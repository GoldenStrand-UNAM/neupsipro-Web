

class ImpForumRepository {

    // Method to retrieve paginated forum data (must be implemented)
    async fetchAll ({page,limit}) {
        throw new Error("fetchAll() must be implemented");
    }
    // Method to save a new publication 
    async save({ id_usuario, titulo, contenido, imagenes }) {
        throw new Error('save() ');
    }
}

module.exports = ImpForumRepository;

