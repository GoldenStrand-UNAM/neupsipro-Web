class ImpUserRepository {
    async fetchActivePatients({ search, page, limit }) {
        throw new Error("fetchActivePatients() must be implemented");
    }
    async countActivePatients({ search }) {
        throw new Error("countActivePatients() must be implemented");
    }
}
module.exports = ImpUserRepository;