/**
 * DTO (Data Transfer Object) for the user profile.
 *  It makes sure to format the data that will be sent to the presentation layer(API).
 */
class userProfileDTO {
  constructor (userProfile) {
    this.personalInfo = {
      fullName: `${userProfile.firstName} ${userProfile.lastNameP} ${userProfile.lastNameM}`.trim(),
      profilePhoto: userProfile.profilePhoto,
      birthDate: this._safeFormatDate(userProfile.birthDate),
      age: userProfile.age !== undefined ? userProfile.age : null,
    };

    this.clinicalInfo = {
      unitEntryDate: this._safeFormatDate(userProfile.unitEntryDate),
      neuroEntryDate: this._safeFormatDate(userProfile.neuroEntryDate),
      neuroStatus: userProfile.neuroStatus,
      protocol: userProfile.protocol,
      state: userProfile.state,
      stage: this._formatStage(userProfile.stage),
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

  _formatStage (stage) {
    const interventionStages = ['Initial', 'Following'];

    if (interventionStages.includes(stage)) {
      return 'Intervention';
    }

    return stage;
  }

  /**
   * Helper method to safely convert a raw date value to YYYY-MM-DD
   * without throwing more errors
   */
  _safeFormatDate (dateValue) {
    if (!dateValue || String(dateValue).trim() === '') return null;

    let normalizedDate = dateValue;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split('/');
      normalizedDate = `${month}/${day}/${year}`;
    }

    const parsedDate = new Date(normalizedDate);
    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toISOString().split('T')[0];
  }
}

module.exports = userProfileDTO;
