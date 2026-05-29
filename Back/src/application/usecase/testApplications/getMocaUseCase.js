const MocaResultsDTO = require('../../dto/mocaResultDTO');

class getMocaResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the Moca result row
    const row = await this.impTestResultsRepository.fetchMocaResult({ id_results });

    if (!row) {
      const err = new Error('Moca result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new MocaResultsDTO({
      idResults: row.id_results,
      idTest: 4,
      status: row.status,
      dateApplied: row.date_applied ?? null,
      score: row.score,
      interpretation: row.interpretation,
      notes: row.notes ?? null,
    });
  }
}

module.exports = getMocaResultUseCase;
