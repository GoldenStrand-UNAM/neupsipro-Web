class ClinicalUserDTO {
  constructor ({
    idUser,
    name,
    birthdate,
    activity,
    affiliation,
    emergencyName,
    emergencyPhone,
    emergencyRelation,
    startDate,
    endDate,
    hours,
  }) {
    this.idUser = idUser;

    this.name = name;
    this.birthdate = birthdate;
    this.activity = activity;
    this.affiliation = affiliation;
    this.emergencyName = emergencyName;
    this.emergencyPhone = emergencyPhone;
    this.emergencyRelation = emergencyRelation;
    this.startDate = startDate;
    this.endDate = endDate;
    this.hours = hours;
  }

  static fromEntity (entity) {
    return new ClinicalUserDTO({
      idUser: entity.idUser,
      name: entity.name,
      birthdate: entity.birthdate,
      activity: entity.activity,
      affiliation: entity.affiliation,
      emergencyName: entity.emergencyName,
      emergencyPhone: entity.emergencyPhone,
      emergencyRelation: entity.emergencyRelation,
      startDate: entity.startDate,
      endDate: entity.endDate,
      hours: entity.hours,
    });
  }
}

module.exports = ClinicalUserDTO;
