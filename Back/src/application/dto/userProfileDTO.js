/**
 * DTO (Data Transfer Object) for the user profile.
 *  It makes sure to format the data that will be sent to the presentation layer(API).
 */
class userProfileDTO {
    constructor (userProfile) {
        this.personalInfo = {
            fullName: `${userProfile.firstName} ${userProfile.lastNameP} ${userProfile.lastNameM}`.trim(),
            profilePhoto: userProfile.profilePhoto,
            birthDate: userProfile.birthDate ? new Date(userProfile.birthDate).toISOString().split('T')[0] : null,
            age: userProfile.age,
        };

        this.clinicalInfo = {
            unitEntryDate: userProfile.unitEntryDate ? new Date(userProfile.unitEntryDate).toISOString().split('T')[0] : null,
            neuroEntryDate: userProfile.neuroEntryDate ? new Date(userProfile.neuroEntryDate).toISOString().split('T')[0] : null,
            neuroStatus: userProfile.neuroStatus,
            protocol: userProfile.protocol,
            state: userProfile.state,
            stage: userProfile.stage,
            prosthetist: userProfile.prosthetist,
        };

        this.assignment = {
            relationId: userProfile.idUserRelation,
            assignedClinic: userProfile.assignedClinic || 'No asignado',
        };

        this.nextAppointment = userProfile.nextAppointmentDate ? {
            date: new Date(userProfile.nextAppointmentDate).toISOString().split('T')[0],
            time: userProfile.nextAppointmentTime ? userProfile.nextAppointmentTime.substring(0, 5) : null,
        } : null;
    }
}

module.exports = userProfileDTO;
