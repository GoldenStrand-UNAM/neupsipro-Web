
class ImpForumRepository {
    async fetchAll ({page,limit}) {
        throw new Error("fetchAll() debe ser implementado");
    }
}

module.exports = ImpForumRepository;