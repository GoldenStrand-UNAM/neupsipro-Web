const WaisResultsDTO = require('../../dto/waisResultDTO');

class getWAISResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the WAIS result row
    const row = await this.impTestResultsRepository.fetchWAISResult({ id_results });

    if (!row) {
      const err = new Error('WAIS result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new WaisResultsDTO({
      idResults: row.id_results,
      idTest: 2,
      status: row.status,
      dateApplied: row.date_applied ?? null,
      areas: {
        comVerbal: { score: row.score_com_verbal,       interpretation: row.inter_com_verbal       },
        razonPerceptual: { score: row.score_razon_perceptual, interpretation: row.inter_razon_perceptual },
        memWork: { score: row.score_mem_work,         interpretation: row.inter_mem_work         },
        veloProce: { score: row.score_velo_proce,       interpretation: row.inter_velo_proce       },
      },
      scoreTotal: row.score_total,
      notes: row.notes ?? null,
    });
  }
}

module.exports = getWAISResultUseCase;
