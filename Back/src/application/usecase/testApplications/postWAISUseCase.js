class postWAISUseCase {
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  /**
   * Saves WAIS score, recalculates interpretation server-side,
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

    // 3. Validate notes length if provided
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }

    // 4. Verify the result row exists for this user, session and test
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 2,
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 5. Recalculate interpretation server-side — never trust the client
    const interpretation = this.resolveInterpretation(parsed);

    // 6. Persist the result
    const updated = await this.impTestResultsRepository.saveResult({
      id_results: row.idResults,
      score: parsed,
      interpretation,
      notes: notes ?? null,
    });

    // 7. Return DTO — never expose raw entity across boundaries
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
   * WAIS interpretation ranges.
   * Score is an integer between 0 and 200.
   */
  resolveInterpretation (score) {
    if (score <= 69)                   return 'Discapacidad';
    if (score >= 70 && score <= 79)    return 'Limítrofe';
    if (score >= 80 && score <= 89)   return 'Promedio Bajo';
    if (score >= 90 && score <= 109)   return 'Promedio';
    if (score >= 110 && score <= 119)  return 'Promedio Alto';
    if (score >= 120 && score <= 129)   return 'Superior';
    if (score >= 130)                   return 'Alta capacidad intelectual';

    return 'Promedio alto'; // score >= 116
  }
}

module.exports = postWAISUseCase;
