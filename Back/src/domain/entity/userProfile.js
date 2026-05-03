/**
 * Domain Entity: userProfile
 * Represents the data structure of the user profile for the business logic.
 * This class is independant from the database or from any framework.
 */
class userProfile {
    constructor ({
        firstName,
        lastNameP,
        lastNameM,
        profilePhoto,
        birthDate,
        registrationDate,
        neuroStatus,
        protocol,
        state,
        prosthetist,
    }) {
        this.firstName = firstName;
        this.lastNameP = lastNameP;
        this.lastNameM = lastNameM;
        this.profilePhoto = profilePhoto;
        this.birthDate = birthDate;
        this.registrationDate = registrationDate;
        this.neuroStatus = neuroStatus;
        this.protocol = protocol;
        this.state = state;
        this.prosthetist = prosthetist;
    }
}

module.exports = userProfile;
