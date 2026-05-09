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
        this.neuroStatus = user.neuroStatus;
        this.basePathology = user.basePathology;
        this.modality = user.modality;
        this.profilePhoto = user.profilePhoto;
        this.registrationDate = user.registrationDate;
        this.referenceNumber = user.referenceNumber;
        this.laterality = user.laterality;
        this.prothesist = user.prothesist;
        this.neuroEntryDate = user.neuroEntryDate;
        this.amputationDate = user.amputationDate;
        this.pairs = user.pairs;
    }
}
module.exports = UsersDTO;