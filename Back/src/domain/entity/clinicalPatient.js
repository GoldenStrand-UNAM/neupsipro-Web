class ClinicalPatient {
  constructor (data) {
    this.name = [data.reference_number, data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.state = data.state;
    this.assigmentDate = data.assignment_date;
    this.type = this.setType(data.type);
  }
  setType (type) {
    if (!type) {
      return null;
    }
    if (type === 'assigned') {
      return 'Asignado';
    }
    if (type === 'initial_interview') {
      return 'Entrevista Inicial';
    }
    if (type === 'appointment')
      return 'Cita';
  }
}
module.exports = ClinicalPatient;
