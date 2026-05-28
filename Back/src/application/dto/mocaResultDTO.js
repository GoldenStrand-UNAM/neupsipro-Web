class MocaResultsDTO {
  constructor ({
    idResults,
    idTest,
    status,
    dateApplied,
    score,
    interpretation,
    notes,
  }) {
    this.idResults     = idResults;
    this.idTest        = idTest;
    this.status        = status;
    this.dateApplied   = dateApplied;
    this.score         = score;
    this.interpretation = interpretation;
    this.notes         = notes ?? null;
  }
}

module.exports = MocaResultsDTO;

