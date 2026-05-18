const BanfeResultsDTO = require('../../dto/banfeResultsDTO');

class postBANFEUseCase {
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  /**
   * Parses and validates a single area score.
   * Must be present, finite, and non-negative.
   */
  #parseAreaScore (value, fieldName) {
    const parsed = Number(value);
    if (value === undefined || value === null || value === '' || isNaN(parsed)) {
      const err = new Error(`${fieldName} must be a valid number`);
      err.status = 422;
      throw err;
    }
    if (parsed < 0) {
      const err = new Error(`${fieldName} must be a non-negative number`);
      err.status = 422;
      throw err;
    }
    return parsed;
  }

  /**
   * BANFE interpretation ranges per area score.
   * Total score has no interpretation — only the sum is stored.
   */
  resolveInterpretation (score) {
    if (score >= 116)              return 'Normal alto';
    if (score >= 85)               return 'Normal';
    if (score >= 70)               return 'Alteración leve-moderada';
    /* score <= 69 */              return 'Alteración severa';
  }

  /**
   * Saves BANFE score, recalculates interpretation server-side,
   * and updates the result row to status 3 (Calificada).
 */
  async execute ({ id_user, id_application, score_orbit_frontal, score_prefrontal_before, score_d_lateral, notes }) {

    // 1. Validate and parse each area score
    const orbitFrontal     = this.#parseAreaScore(score_orbit_frontal,     'score_orbit_frontal');
    const prefrontalBefore = this.#parseAreaScore(score_prefrontal_before,  'score_prefrontal_before');
    const dLateral         = this.#parseAreaScore(score_d_lateral,          'score_d_lateral');

    // 2. Validate notes length if provided
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
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

    // 4. Recalculate interpretations server-side — never trust the client
    const interOrbitFrontal     = this.resolveInterpretation(orbitFrontal);
    const interPrefrontalBefore = this.resolveInterpretation(prefrontalBefore);
    const interDLateral         = this.resolveInterpretation(dLateral);

    // 5. Compute total score — sum of all three areas, no interpretation
    const scoreTotal = orbitFrontal + prefrontalBefore + dLateral;

    // 6. Persist the result
    const saved = await this.impTestResultsRepository.saveBANFEResult({
      id_results: row.idResults,
      score_orbit_frontal: orbitFrontal,
      inter_orbit_frontal: interOrbitFrontal,
      score_prefrontal_before: prefrontalBefore,
      inter_prefrontal_before: interPrefrontalBefore,
      score_d_lateral: dLateral,
      inter_d_lateral: interDLateral,
      score_total: scoreTotal,
      notes: notes ?? null,
    });

    // 7. Return DTO — never expose raw entity across boundaries
    return new BanfeResultsDTO({
      idResults: row.idResults,
      idTest: 1,
      status: 3,
      areas: {
        orbitFrontal: {
          score: saved.score_orbit_frontal,
          interpretation: saved.inter_orbit_frontal,
        },
        prefrontalBefore: {
          score: saved.score_prefrontal_before,
          interpretation: saved.inter_prefrontal_before,
        },
        dLateral: {
          score: saved.score_d_lateral,
          interpretation: saved.inter_d_lateral,
        },
      },
      scoreTotal: saved.score_total,
      notes: saved.notes,
    });

  }

}

module.exports = postBANFEUseCase;
