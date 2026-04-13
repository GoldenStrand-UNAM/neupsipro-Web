class ImpForumRepository {

    // Method to retrieve paginated forum data (must be implemented)
    async fetchAll ({_page,_limit}) {
        throw new Error("fetchAll() must be implemented");
    }
}

module.exports = ImpForumRepository;