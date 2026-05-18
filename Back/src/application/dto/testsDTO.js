class TestsDTO {
  constructor (
    idTest,
    testName,
    idResults,
    status,
    dateApplied
  ) {
    this.idTest      = idTest;
    this.testName    = testName;
    this.idResults   = idResults;
    this.status      = status;
    this.dateApplied = dateApplied;
  }
}

module.exports = TestsDTO;
