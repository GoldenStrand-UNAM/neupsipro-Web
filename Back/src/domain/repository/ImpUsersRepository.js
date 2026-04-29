class ImpUsersRepository {

    // In case function is not implemented
    async fetchOne ({id_user: _id_user}) {
        throw new Error("fetchOne() user must be implemented");
    }


    async fetchActivePatients ({ _search, _page, _limit }) {
        throw new Error("fetchActivePatients() must be implemented");
    }
    async countActivePatients ({ _search }) {
        throw new Error("countActivePatients() must be implemented");
    }
}
module.exports = ImpUsersRepository;