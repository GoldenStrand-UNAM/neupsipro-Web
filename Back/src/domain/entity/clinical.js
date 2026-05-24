class Clinical {
  constructor (data) {
    this.idUser = data.id_user;
    this.name = [data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.birthdate = data.birthdate;
    this.activity = data.activity;
    this.affiliation = data.affiliation;
    this.emergencyName = data.emergency_contact_name;
    this.emergencyPhone = data.emergency_contact_phone;
    this.emergencyRelation = data.emergency_contact_relation;
    this.startDate = data.start_date;
    this.endDate = data.finish_date;
    this.hours = data.hours;
  }
}
module.exports = Clinical;
