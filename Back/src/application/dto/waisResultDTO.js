class WaisResultsDTO {
  constructor ({
    idResults,
    idTest,
    status,
    dateApplied,
    areas,
    scoreTotal,
    interTotal,
    notes,
  }) {
    this.idResults   = idResults;
    this.idTest      = idTest;
    this.status      = status;
    this.dateApplied = dateApplied;
    this.areas       = {
      comVerbal: {
        score: areas.comVerbal.score,
        interpretation: areas.comVerbal.interpretation,
      },
      razonPerceptual: {
        score: areas.razonPerceptual.score,
        interpretation: areas.razonPerceptual.interpretation,
      },
      memWork: {
        score: areas.memWork.score,
        interpretation: areas.memWork.interpretation,
      },
      veloProce: {
        score: areas.veloProce.score,
        interpretation: areas.veloProce.interpretation,
      },
    };
    this.scoreTotal  = scoreTotal;
    this.interTotal = interTotal ?? null;
    this.notes       = notes ?? null;
  }
}

module.exports = WaisResultsDTO;
