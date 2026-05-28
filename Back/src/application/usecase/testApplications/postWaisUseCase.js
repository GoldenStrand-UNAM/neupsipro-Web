const waisResultsDTO = require('../../dto/waisResultDTO');

class postWaisUseCase {
  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // Parses and validates a single area score.
  // Must be present, finite, and non-negative.
  #parseAreaScore (value, fieldName) {
    const parsed = Number(value);
    if (value === undefined || value === null || value === '' || isNaN(parsed)) {
      const err = new Error(`${fieldName} must be a valid number`);
      err.status = 422;
      throw err;
    }
    if (parsed < 0 || parsed > 300) {
      const err = new Error(`${fieldName} must be between 0 and 300`);
      err.status = 422;
      throw err;
    }
    return parsed;
  }

  // wais interpretation ranges per area score.
  resolveInterpretation (score) {
    if (score >= 130) return 'Alta capacidad intelectual';
    if (score >= 120) return 'Superior';
    if (score >= 110) return 'Promedio alto';
    if (score >= 90)  return 'Promedio';
    if (score >= 80)  return 'Promedio bajo';
    if (score >= 70)  return 'Limítrofe';
    return 'Discapacidad';
  }

  #validateNotes (notes) {
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }
  }

  #buildSavePayload ({
    idResults, comVerbal, interComVerbal,
    razonPerceptual, interRazonPerceptual,
    memWork, interMemWork, veloProce, interVeloProce,
    total, interTotal, notes,
  }) {
    return {
      id_results: idResults,
      score_com_verbal: comVerbal,
      inter_com_verbal: interComVerbal,
      score_razon_perceptual: razonPerceptual,
      inter_razon_perceptual: interRazonPerceptual,
      score_mem_work: memWork,
      inter_mem_work: interMemWork,
      score_velo_proce: veloProce,
      inter_velo_proce: interVeloProce,
      score_total: total,
      inter_total: interTotal,
      notes: notes ?? null,
    };
  }

  #mapToDTO (idResults, saved) {
    return new waisResultsDTO({
      idResults,
      idTest: 2,
      status: 3,
      dateApplied: saved.date_applied ?? null,
      areas: {
        comVerbal: { score: saved.score_com_verbal,       interpretation: saved.inter_com_verbal       },
        razonPerceptual: { score: saved.score_razon_perceptual, interpretation: saved.inter_razon_perceptual },
        memWork: { score: saved.score_mem_work,         interpretation: saved.inter_mem_work         },
        veloProce: { score: saved.score_velo_proce,       interpretation: saved.inter_velo_proce       },
      },
      scoreTotal: saved.score_total,
      interTotal: saved.inter_total,
      notes: saved.notes ?? null,
    });
  }

  async execute ({
    id_user, id_application,
    score_com_verbal, score_razon_perceptual,
    score_mem_work, score_velo_proce,
    score_total, notes,
  }) {
    const comVerbal       = this.#parseAreaScore(score_com_verbal,       'score_com_verbal');
    const razonPerceptual = this.#parseAreaScore(score_razon_perceptual, 'score_razon_perceptual');
    const memWork         = this.#parseAreaScore(score_mem_work,         'score_mem_work');
    const veloProce       = this.#parseAreaScore(score_velo_proce,       'score_velo_proce');
    const total           = this.#parseAreaScore(score_total,            'score_total');

    this.#validateNotes(notes);

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

    // recalculate server-side — never trust the client
    const interComVerbal       = this.resolveInterpretation(comVerbal);
    const interRazonPerceptual = this.resolveInterpretation(razonPerceptual);
    const interMemWork         = this.resolveInterpretation(memWork);
    const interVeloProce       = this.resolveInterpretation(veloProce);
    const interTotal           = this.resolveInterpretation(total);

    const saved = await this.impTestResultsRepository.saveWaisResult(this.#buildSavePayload({
      idResults: row.idResults, comVerbal, interComVerbal,
      razonPerceptual, interRazonPerceptual,
      memWork, interMemWork, veloProce, interVeloProce,
      total, interTotal, notes,
    }));

    return this.#mapToDTO(row.idResults, saved);
  }

}

module.exports = postWaisUseCase;
