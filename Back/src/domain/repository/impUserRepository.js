class ImpUserRepository {

    // In case function is not implemented
    async fetchOne ({id_user: _id_user}) {
        throw new Error("fetchOne() must be implemented");
    }
}

module.exports = ImpUserRepository;