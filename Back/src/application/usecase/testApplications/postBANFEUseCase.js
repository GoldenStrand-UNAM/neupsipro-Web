class postBANFEUseCase {
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
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

  }

}

module.exports = postBANFEUseCase;
