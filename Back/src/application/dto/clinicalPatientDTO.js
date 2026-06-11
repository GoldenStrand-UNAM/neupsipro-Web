class ClinicalPatientDTO {
  constructor ({
    id,
    name,
    state,
    assigmentDate,

  }) {
    this.id = id,
    this.name = name;
    this.state = state;
    this.assigmentDate = assigmentDate;
  }

  static fromEntity (entity) {
    return new ClinicalPatientDTO({
      id: entity.id,
      name: entity.name,
      state: entity.state,
      assigmentDate: entity.assigmentDate,

    });
  }
}

module.exports = ClinicalPatientDTO;
