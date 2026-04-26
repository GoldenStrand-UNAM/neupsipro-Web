class ImpClinicalRepository {
    async fetchActivePatients ({ _search, _page, _limit }) {
        throw new Error("fetchActivePatients() must be implemented");
    }
    async countActivePatients ({ _search }) {
        throw new Error("countActivePatients() must be implemented");
    }
}
module.exports = ImpClinicalRepository;