class ImpUsersRepository {
    async fetchActivePatients ({ _search, _page, _limit }) {
        throw new Error("fetchActivePatients() must be implemented");
    }
    async countActivePatients ({ _search }) {
        throw new Error("countActivePatients() must be implemented");
    }
    async postUser({ _idRole, _userName, _firstName, _lastnameP, _lastnameM, _birthdate, _passwordHash, _assigned, _neuroStatus, _basePathology, _modality, _profilePhoto, _referenceNumber, _laterality, _prothesist, _neuroEntryDate, _amputationDate, _pairs }) {
        throw new Error("postUser() must be implemented");
    }
}
module.exports = ImpUsersRepository;