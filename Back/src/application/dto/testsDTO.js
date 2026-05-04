class TestsDTO {
  // eslint-disable-next-line max-params
  constructor (
    idTest,
    testName,
    description,
    idResults,
    score,
    interpretation,
    dateApplied,
    notes,
    status
  ) {
    this.idTest = idTest;
    this.testName = testName;
    this.description = description;
    this.idResults = idResults;
    this.score = score;
    this.interpretation = interpretation;
    this.dateApplied = dateApplied;
    this.notes = notes;
    this.status = status;
  }
}
module.exports = TestsDTO;
