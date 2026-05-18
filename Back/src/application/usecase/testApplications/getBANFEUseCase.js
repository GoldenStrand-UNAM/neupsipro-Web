const banfeResultsDTO = require('../../dto/banfeResultsDTO');

class getBANFEResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the BANFE result row
    const row = await this.impTestResultsRepository.fetchBANFEResult({ id_results });

    if (!row) {
      const err = new Error('BANFE result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new banfeResultsDTO({
      idResults: row.id_results,
      idTest: 1,
      status: row.status,
      dateApplied: row.date_applied ?? null,
      areas: {
        orbitFrontal: { score: row.score_orbit_frontal,    interpretation: row.inter_orbit_frontal     },
        prefrontalBefore: { score: row.score_prefrontal_before, interpretation: row.inter_prefrontal_before },
        dLateral: { score: row.score_d_lateral,         interpretation: row.inter_d_lateral         },
      },
      scoreTotal: row.score_total,
      notes: row.notes ?? null,
    });
  }
}

module.exports = getBANFEResultUseCase;
