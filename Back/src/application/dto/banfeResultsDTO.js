
class BanfeResultsDTO {
  constructor ({
    idResults,
    idTest,
    status,
    dateApplied,
    areas,
    scoreTotal,
    notes,
  }) {
    this.idResults   = idResults;
    this.idTest      = idTest;
    this.status      = status;
    this.dateApplied = dateApplied;
    this.areas       = {
      orbitFrontal: {
        score:          areas.orbitFrontal.score,
        interpretation: areas.orbitFrontal.interpretation,
      },
      prefrontalBefore: {
        score:          areas.prefrontalBefore.score,
        interpretation: areas.prefrontalBefore.interpretation,
      },
      dLateral: {
        score:          areas.dLateral.score,
        interpretation: areas.dLateral.interpretation,
      },
    };
    this.scoreTotal  = scoreTotal;
    this.notes       = notes ?? null;
  }
}

module.exports = BanfeResultsDTO;