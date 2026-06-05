const MocaResultsDTO = require('../../dto/mocaResultDTO');

class postMocaUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // Maps schooling label to years of education.
  // Used to determine if the +2 bonus applies.
  resolveSchoolingYears (schooling) {
    const map = {
      'Sin escolaridad': 0,
      'Primaria': 6,
      'Secundaria': 9,
      'Bachillerato': 12,
      'Licenciatura': 16,
      'Posgrado': 18,
    };
    return map[schooling] ?? null;
  }

  // Applies +2 bonus if schooling <= 12 years and raw score <= 29.
  // Final score is capped at 30.
  resolveScore (rawScore, schoolingYears) {
    let final = rawScore;
    if (schoolingYears !== null && schoolingYears <= 12 && rawScore <= 29) {
      final = rawScore + 2;
    }
    return Math.min(final, 30);
  }

  // Moca interpretation ranges applied to the final score.
  resolveInterpretation (finalScore) {
    if (finalScore >= 26) return 'Rendimiento cognitivo normal';
    if (finalScore >= 18) return 'Deterioro cognitivo leve';
    if (finalScore >= 10) return 'Deterioro cognitivo moderado';
    return 'Deterioro cognitivo grave';
  }

  // Saves Moca result, recalculates final score and interpretation
  // server-side, and updates status to 3 (Calificada).
  async execute ({ id_user, id_application, score, notes }) {

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

    // 4. Verify result row exists for this application and test
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

    // 5. Fetch schooling server-side — never trust the client
    const schooling      = await this.impTestResultsRepository.fetchUserSchooling({ id_user });
    const schoolingYears = this.resolveSchoolingYears(schooling);

    // 6. Compute final score and interpretation server-side
    const finalScore     = this.resolveScore(raw, schoolingYears);
    const interpretation = this.resolveInterpretation(finalScore);

    // 7. Persist into Moca_results — save final score, not raw
    const saved = await this.impTestResultsRepository.saveMocaResult({
      id_results: row.idResults,
      score: finalScore,
      interpretation,
      notes: notes ?? null,
    });

    // 8. Map to DTO — never expose raw DB row across boundaries
    return new MocaResultsDTO({
      idResults: row.idResults,
      idTest: 4,
      status: 3,
      dateApplied: saved.date_applied ?? null,
      score: saved.score,
      interpretation: saved.interpretation,
      notes: saved.notes ?? null,
    });
  }
}

module.exports = postMocaUseCase;
