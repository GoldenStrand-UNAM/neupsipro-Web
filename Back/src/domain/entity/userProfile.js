/**
 * Domain Entity: userProfile
 * Represents the data structure of the user profile for the business logic.
 * This class is independant from the database or from any framework.
 */
class userProfile {
  constructor (rows) {
    const baseRow = rows[0] || {};

    this.firstName = baseRow.first_name;
    this.lastNameP = baseRow.lastname_p;
    this.lastNameM = baseRow.lastname_m;
    this.profilePhoto = baseRow.profile_photo;
    this.birthDate = baseRow.birthdate;
    this.registrationDate = baseRow.registration_date;
    this.neuroEntryDate = baseRow.neuro_entry_date;
    this.neuroStatus = baseRow.neuro_status;
    this.protocol = baseRow.protocol;
    this.state = baseRow.state;
    this.stage = baseRow.stage;
    this.prosthetist = baseRow.prosthetist;
    this.idUserRelation = baseRow.id_user_relation;

    const assignedRow = rows.find(r => r.type === 'assigned');
    this.assignedClinic = assignedRow ? assignedRow.assigned_clinic_name : null;

    const appointmentRow = rows.find(r => r.type === 'appointment');
    this.nextAppointmentDate = appointmentRow ? appointmentRow.next_appointment_date : null;
    this.nextAppointmentTime = appointmentRow ? appointmentRow.next_appointment_time : null;

    this.age = this._calculateAge(baseRow.birthdate);
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
