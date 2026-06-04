class Clinical {
  constructor (data) {
    this.idUser = data.id_user;
    this.name = [data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.birthdate = this.formatDate(data.birthdate);
    this.activity = data.activity;
    this.affiliation = data.affiliation;
    this.emergencyName = data.emergency_contact_name;
    this.emergencyPhone = data.emergency_contact_phone;
    this.emergencyRelation = data.emergency_contact_relation;
    this.startDate = this.formatDate(data.start_date);
    this.endDate = this.formatDate(data.finish_date);
    this.hours = data.hours;
  }

  formatDate (rawDate) {
    if (!rawDate) return null;
    let day; let month; let year;
    if (typeof rawDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate))
      [day, month, year] = rawDate.split('/').map(Number);
    else
      [year, month, day] = rawDate.split('-').map(Number);
    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) return null;
    const dd = String(day).padStart(2, '0');
    const mm = String(month).padStart(2, '0');
    const yyyy = year;
    return `${dd}/${mm}/${yyyy}`;
  }
}
module.exports = Clinical;
