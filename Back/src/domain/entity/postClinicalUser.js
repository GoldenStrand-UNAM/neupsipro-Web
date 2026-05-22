class ClinicalUser {
  constructor ({
    idRole,
    firstName,
    lastnameP,
    lastnameM,
    birthdate,
    email,
    affiliation,
    activity,
    startDate,
    finishDate,
    hours,
    username,
    passwordHash,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
  }) {
    this.idRole = idRole,
    this.firstName = firstName,
    this.lastnameP = lastnameP,
    this.lastnameM = lastnameM || null,
    this.birthdate = birthdate,
    this.email = email || null,
    this.affiliation = affiliation,
    this.activity = activity,
    this.startDate = startDate,
    this.finishDate = finishDate,
    this.hours = hours || null,
    this.username = username,
    this.password = passwordHash,
    this.emergencyContactName = emergencyContactName || null,
    this.emergencyContactPhone = emergencyContactPhone || null,
    this.emergencyContactRelation = emergencyContactRelation || null;
  }
}

module.exports = ClinicalUser;
