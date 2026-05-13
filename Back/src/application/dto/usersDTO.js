class UsersDTO {
    constructor(user) {
        this.idRole = user.idRole;
        this.userName = user.userName;
        this.firstName = user.firstName;
        this.lastnameP = user.lastnameP;
        this.lastnameM = user.lastnameM;
        this.birthdate = user.birthdate;
        this.passwordHash = user.passwordHash;
        this.assigned = user.assigned;
        this.phase = user.phase;
        this.basePathology = user.basePathology;
        this.modality = user.modality;
        this.profilePhoto = user.profilePhoto;
        this.referenceNumber = user.referenceNumber;
        this.laterality = user.laterality;
        this.prosthetist = user.prosthetist;
        this.neuroEntryDate = user.neuroEntryDate;
        this.amputationDate = user.amputationDate;
        this.amputationLevel = user.amputationLevel;
        this.pairs = user.pairs;
        this.sex = user.sex;
    }
}
module.exports = UsersDTO;