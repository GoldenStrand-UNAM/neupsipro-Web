/**
 * DTO (Data Transfer Object) for the user profile.
 *  It makes sure to format the data that will be sent to the presentation layer(API).
 */
class userProfileDTO {
    constructor (userProfile) {
        this.fullName = `${userProfile.firstName} ${userProfile.lastNameP} ${userProfile.lastNameM}`;
        this.profilePhoto = userProfile.profilePhoto;
        this.birthDate = userProfile.birthDate;
        this.registrationDate = userProfile.registrationDate;
        this.neuroStatus = userProfile.neuroStatus;
        this.protocol = userProfile.protocol;
        this.state = userProfile.state;
        this.prosthetist = userProfile.prosthetist;
    }
}

module.exports = userProfileDTO;
