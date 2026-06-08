class EmotionResultsDTO {
  constructor ({ idResults, idTest, status, dateApplied,
                 scoreAnxietyBeck, interAnxietyBeck,
                 scoreDepressionBeck, interDepressionBeck, notes }) {
    this.idResults            = idResults;
    this.idTest               = idTest;
    this.status               = status;
    this.dateApplied          = dateApplied;
    this.scoreAnxietyBeck     = scoreAnxietyBeck    ?? null;
    this.interAnxietyBeck     = interAnxietyBeck    ?? null;
    this.scoreDepressionBeck  = scoreDepressionBeck ?? null;
    this.interDepressionBeck  = interDepressionBeck ?? null;
    this.notes                = notes               ?? null;
  }
}

module.exports = EmotionResultsDTO;
