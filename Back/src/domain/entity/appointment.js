class Appointment {
  constructor (data) {
    this.idAppointment = data.id_appointment;
    this.idUserRelation = data.id_user_relation;
    this.issue = data.issue;
    this.dateTime = data.date_time;
    this.clinicName = data.clinic_name || null;
  }
}
module.exports = Appointment;