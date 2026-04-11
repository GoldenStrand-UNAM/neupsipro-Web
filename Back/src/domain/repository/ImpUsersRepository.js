class ImpUsersRepository {

    // In case function is not implemented
    async fetchOne ({id_user: _id_user}) {
        throw new Error("fetchOne() user must be implemented");
    }
}

module.exports = ImpUsersRepository;