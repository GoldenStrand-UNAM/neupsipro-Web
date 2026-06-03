class physicalConcernsDTO {
  constructor({
    headache,
    dizziness,
    urinary_inconsistency,
    skin_problem, 
    id_user_relation,
  }) {
    this.headache = headache,
    this.idTest = dizziness,
    this.urinaryInconsistency = urinary_inconsistency,
    this.skinProblem = skin_problem,
    this.idUserRelation = id_user_relation;
  }
}

module.exports = physicalConcernsDTO;