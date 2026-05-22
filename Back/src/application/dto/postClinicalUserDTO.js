class ClinicalUserDTO {
  constructor (clinicalUser) {
    this.idRole = clinicalUser.idRole;
    this.firstName = clinicalUser.firstName;
    this.lastnameP = clinicalUser.lastnameP;
    this.lastnameM = clinicalUser.lastnameM || null;
    this.birthdate = clinicalUser.birthdate;
    this.email = clinicalUser.email || null;
    this.affiliation = clinicalUser.affiliation;
    this.activity = clinicalUser.activity;
    this.startDate = clinicalUser.startDate;
    this.finishDate = clinicalUser.finishDate;
    this.hours = clinicalUser.hours || null;
    this.username = clinicalUser.username;
    this.passwordHash = clinicalUser.passwordHash;
    this.emergencyContactName = clinicalUser.emergencyContactName || null;
    this.emergencyContactPhone = clinicalUser.emergencyContactPhone || null;
    this.emergencyContactRelation = clinicalUser.emergencyContactRelation || null;
  } static fromEntity (entity) {
    return new ClinicalUserDTO ({
      idRole: entity.id_role,
      firstName: entity.first_name,
      lastnameP: entity.lastname_p,
      lastnameM: entity.lastname_m,
      birthdate: entity.birthdate,
      email: entity.email,
      affiliation: entity.affiliation,
      activity: entity.activity,
      startDate: entity.start_date,
      finishDate: entity.finish_date,
      hours: entity.hours,
      username: entity.user_name,
      passwordHash: entity.password_hash,
      emergencyContactName: entity.emergency_contact_name,
      emergencyContactPhone: entity.emergency_contact_phone,
      emergencyContactRelation: entity.emergency_contact_relation,
    });
  }
}
module.exports = ClinicalUserDTO;