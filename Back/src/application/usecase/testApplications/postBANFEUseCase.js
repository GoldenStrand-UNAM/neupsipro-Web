class postBANFEUseCase {
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  /**
   * Saves BANFE score, recalculates interpretation server-side,
   * and updates the result row to status 3 (Calificada).
 */
  async execute ({ id_user, id_application, score, notes }) {

    // 1. Validate score is present and is a number
    const parsed = Number(score);
    if (score === undefined || score === null || score === '' || isNaN(parsed)) {
      const err = new Error('score must be a valid number');
      err.status = 422;
      throw err;
    }

    // 2. Validate score range
    if (parsed < 0 || parsed > 200) {
      const err = new Error('score must be between 0 and 200');
      err.status = 422;
      throw err;
    }

    // 3. Verify the result row exists for this user, session and test
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 1,
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 4. Recalculate interpretation server-side — never trust the client
    const interpretation = this.resolveInterpretation(parsed);

    // 5. Persist the result
    const updated = await this.impTestResultsRepository.saveResult({
      id_results: row.idResults,
      score: parsed,
      interpretation,
      notes: notes ?? null,
    });

    // 6. Return DTO — never expose raw entity across boundaries
    return {
      idResults: updated.idResults,
      idTest: updated.idTest,
      testName: updated.testName,
      status: updated.status,
      score: updated.score,
      interpretation: updated.interpretation,
      dateApplied: updated.dateApplied,
      notes: updated.notes,
    };
  }

  /**
   * BANFE interpretation ranges.
   * Score is an integer between 0 and 200.
   */
  resolveInterpretation (score) {
    if (score <= 69)                   return 'Discapacidad';
    if (score >= 70 && score <= 84)    return 'Limítrofe';
    if (score >= 85 && score <= 115)   return 'Promedio';
    return 'Promedio alto'; // score >= 116
  }
}

module.exports = postBANFEUseCase;
