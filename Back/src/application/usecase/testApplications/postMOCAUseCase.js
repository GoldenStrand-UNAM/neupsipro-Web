class postMOCAUseCase {

  constructor(impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  /**
   * Maps schooling label to years of education.
   * Used to determine if the +2 bonus applies.
   */
  resolveSchoolingYears(schooling) {
    const map = {
      'Sin escolaridad': 0,
      'Primaria':        6,
      'Secundaria':      9,
      'Bachillerato':    12,
      'Licenciatura':    16,
      'Posgrado':        18,
    };
    return map[schooling] ?? null;
  }

  /**
   * Applies MoCA scoring rules:
   * - Base score capped at 30
   * - +2 bonus if schooling <= 12 years AND base score <= 28
   * - Final score capped at 30
   */
  resolveScore(rawScore, schoolingYears) {
    let final = rawScore;
    if (schoolingYears !== null && schoolingYears <= 12 && rawScore <= 28) {
      final = rawScore + 2;
    }
    return Math.min(final, 30);
  }

  /**
   * MoCA interpretation ranges based on final score.
   */
  resolveInterpretation(finalScore) {
    if (finalScore >= 26) return 'Rendimiento cognitivo normal';
    if (finalScore >= 18) return 'Deterioro cognitivo leve';
    if (finalScore >= 10) return 'Deterioro cognitivo moderado';
    return 'Deterioro cognitivo grave';
  }

  // Process MOCA results: validate input, apply scoring rules, and persist final score and interpretation.
  async execute({ id_user, id_application, score, notes }) {

    // 1. Validate score is present and numeric
    const raw = Number(score);
    if (score === undefined || score === null || score === '' || isNaN(raw)) {
      const err = new Error('score must be a valid number');
      err.status = 422;
      throw err;
    }

    // 2. Validate raw score range (0-30 before bonus)
    if (raw < 0 || raw > 30) {
      const err = new Error('score must be between 0 and 30');
      err.status = 422;
      throw err;
    }

    // 3. Validate notes length
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }

    // 4. Verify result row exists for this session and test
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 4, 
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 5. Fetch schooling to determine bonus eligibility
    const schooling      = await this.impTestResultsRepository.fetchUserSchooling({ id_user });
    const schoolingYears = this.resolveSchoolingYears(schooling);

    // 6. Calculate final score and interpretation server-side
    const finalScore     = this.resolveScore(raw, schoolingYears);
    const interpretation = this.resolveInterpretation(finalScore);

    // 7. Persist — save the final score (after bonus), not the raw score
    const updated = await this.impTestResultsRepository.saveResult({
      id_results: row.idResults,
      score:      finalScore,
      interpretation,
      notes:      notes ?? null,
    });

    // 8. Return DTO with all fields the client needs
    return {
      idResults:      updated.idResults,
      idTest:         updated.idTest,
      testName:       updated.testName,
      status:         updated.status,
      score:          updated.score,
      interpretation: updated.interpretation,
      dateApplied:    updated.dateApplied,
      notes:          updated.notes,
    };
  }
}

module.exports = postMOCAUseCase;