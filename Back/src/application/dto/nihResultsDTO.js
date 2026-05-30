class NihResultsDTO {
  constructor ({
    idResults,
    idTest,
    status,
    dateApplied,
    notes,
  }) {
    this.idResults   = idResults;
    this.idTest      = idTest;
    this.status      = status;
    this.dateApplied = dateApplied;
    this.notes       = notes ?? null;
  }
}

module.exports = NihResultsDTO;
