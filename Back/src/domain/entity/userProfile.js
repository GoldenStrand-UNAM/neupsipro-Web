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
        unitEntryDate,
        neuroEntryDate,
        neuroStatus,
        protocol,
        state,
        stage,
        prosthetist,
        idUserRelation,
        assignedClinic,
        nextAppointmentTime,
        nextAppointmentDate,
    }) {
        this.firstName = firstName;
        this.lastNameP = lastNameP;
        this.lastNameM = lastNameM;
        this.profilePhoto = profilePhoto;
        this.birthDate = birthDate;
        this.unitEntryDate = unitEntryDate;
        this.neuroEntryDate = neuroEntryDate;
        this.neuroStatus = neuroStatus;
        this.protocol = protocol;
        this.state = state;
        this.stage = stage;
        this.prosthetist = prosthetist;
        this.idUserRelation = idUserRelation;
        this.assignedClinic = assignedClinic;
        this.nextAppointmentDate = nextAppointmentDate;
        this.nextAppointmentTime = nextAppointmentTime;
        this.age = this._calculateAge(birthDate);
    }

    _calculateAge (birthDate) {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age = age - 1;
        }
        return age;
    }
}

module.exports = userProfile;
