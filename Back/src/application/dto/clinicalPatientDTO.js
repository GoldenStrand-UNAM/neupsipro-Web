class ClinicalPatientDTO {
  constructor ({
    name,
    state,
    assigmentDate,
    type,

  }) {
    this.name = name;
    this.state = state;
    this.assigmentDate = assigmentDate;
    this.type = type;
  }

  static fromEntity (entity) {
    return new ClinicalPatientDTO({
      name: entity.name,
      state: entity.state,
      assigmentDate: entity.assigmentDate,
      type: entity.type,

    });
  }
}

module.exports = ClinicalPatientDTO;
