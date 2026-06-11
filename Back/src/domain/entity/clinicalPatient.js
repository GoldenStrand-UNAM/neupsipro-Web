class ClinicalPatient {
  constructor (data) {
    this.id = data.id_user,
    this.name = [data.reference_number, data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.state = data.state;
    this.assigmentDate = data.assignment_date;
  }
}
module.exports = ClinicalPatient;
