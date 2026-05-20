class ClinicalPatientDTO {
  constructor ({
    id,
    name,
    state,
    assigmentDate,
    type,

  }) {
    this.id = id,
    this.name = name;
    this.state = state;
    this.assigmentDate = assigmentDate;
    this.type = type;
  }

  static fromEntity (entity) {
    return new ClinicalPatientDTO({
      id: entity.id,
      name: entity.name,
      state: entity.state,
      assigmentDate: entity.assigmentDate,
      type: entity.type,

    });
  }
}

module.exports = ClinicalPatientDTO;
