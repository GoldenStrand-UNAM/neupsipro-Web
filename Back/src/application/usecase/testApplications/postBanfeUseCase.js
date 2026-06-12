const banfeResultsDTO = require('../../dto/banfeResultsDTO');

class postBanfeUseCase {
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
    if (parsed < 0 || parsed > 200) {
      const err = new Error(`${fieldName} must be between 0 and 200`);
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

  #validateAndParse ({ score_orbit_frontal, score_prefrontal_before, score_d_lateral, score_total, notes }) {
    const orbitFrontal     = this.#parseAreaScore(score_orbit_frontal,    'score_orbit_frontal');
    const prefrontalBefore = this.#parseAreaScore(score_prefrontal_before, 'score_prefrontal_before');
    const dLateral         = this.#parseAreaScore(score_d_lateral,         'score_d_lateral');
    const parsed = Number(score_total);
    if (score_total === undefined || score_total === null || score_total === '' || isNaN(parsed)) {
      const err = new Error('score_total must be a valid number');
      err.status = 422;
      throw err;
    }
    if (parsed < 0 || parsed > 600) {
      const err = new Error('score_total must be between 0 and 600');
      err.status = 422;
      throw err;
    }
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }
    return { orbitFrontal, prefrontalBefore, dLateral, scoreTotal: parsed };
  }

  async execute ({ id_user, id_application, score_orbit_frontal, score_prefrontal_before, score_d_lateral, score_total, notes }) {
    const { orbitFrontal, prefrontalBefore, dLateral, scoreTotal } =
      this.#validateAndParse({ score_orbit_frontal, score_prefrontal_before, score_d_lateral, score_total, notes });

    const row = await this.impTestResultsRepository.fetchResultRow({ id_user, id_application, id_test: 1 });
    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    const interOrbitFrontal     = this.resolveInterpretation(orbitFrontal);
    const interPrefrontalBefore = this.resolveInterpretation(prefrontalBefore);
    const interDLateral         = this.resolveInterpretation(dLateral);
    const interTotal            = this.resolveInterpretation(scoreTotal);

    const saved = await this.impTestResultsRepository.saveBanfeResult({
      id_results: row.idResults,
      score_orbit_frontal: orbitFrontal,
      inter_orbit_frontal: interOrbitFrontal,
      score_prefrontal_before: prefrontalBefore,
      inter_prefrontal_before: interPrefrontalBefore,
      score_d_lateral: dLateral,
      inter_d_lateral: interDLateral,
      score_total: scoreTotal,
      inter_total: interTotal,
      notes: notes ?? null,
    });

    return new banfeResultsDTO({
      idResults: row.idResults,
      idTest: 1,
      status: 3,
      dateApplied: saved.date_applied ?? null,
      areas: {
        orbitFrontal: { score: saved.score_orbit_frontal,     interpretation: saved.inter_orbit_frontal     },
        prefrontalBefore: { score: saved.score_prefrontal_before, interpretation: saved.inter_prefrontal_before },
        dLateral: { score: saved.score_d_lateral,         interpretation: saved.inter_d_lateral         },
      },
      scoreTotal: saved.score_total,
      interTotal: saved.inter_total,
      notes: saved.notes,
    });
  }

}

module.exports = postBanfeUseCase;
