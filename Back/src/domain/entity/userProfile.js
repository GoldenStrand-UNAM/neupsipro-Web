/**
 * Domain Entity: userProfile
 * Represents the data structure of the user profile for the business logic.
 * This class is independent from the database or from any framework.
 */
class userProfile {
  constructor (data) {
    this.firstName = data.first_name;
    this.lastNameP = data.lastname_p;
    this.lastNameM = data.lastname_m;
    this.profilePhoto = data.profile_photo;
    this.birthDate = data.birthdate;
    this.registrationDate = data.registration_date;
    this.neuroEntryDate = data.neuro_entry_date;
    this.neuroStatus = data.neuro_status;
    this.protocol = data.protocol;
    this.state = data.state;
    this.stage = data.stage;
    this.prosthetist = data.prosthetist;

    const relations = data.relations || [];

    const assignedRelation = relations.find(r => r.type === 'assigned');
    this.assignedClinic = assignedRelation ? assignedRelation.assignedClinic : null;

    const appointmentRelation = relations.find(r => r.type === 'appointment');
    this.nextAppointmentDate = appointmentRelation ? appointmentRelation.nextAppointmentDate :
      data.next_appointment_date || null;
    this.nextAppointmentTime = appointmentRelation ? appointmentRelation.nextAppointmentTime :
      data.next_appointment_time || null;

    this.age = this._calculateAge(data.birthdate);
  }

  _calculateAge (birthDate) {
    if (!birthDate || String(birthDate).trim() === '') return null;
    let normalizedDate = String(birthDate).trim();

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalizedDate)) {
      const [day, month, year] = normalizedDate.split('/');
      normalizedDate = `${year}-${month}-${day}`;
    }

    const birth = new Date(normalizedDate);
    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age = age - 1;
    }
    return age;
  }
}

module.exports = userProfile;
