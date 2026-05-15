const NihResultsDTO = require('../../dto/nihResultsDTO');

class getNIHResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the NIH result row
    const row = await this.impTestResultsRepository.fetchNIHResult({ id_results });

    if (!row) {
      const err = new Error('NIH result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new NihResultsDTO({
      idResults:   row.id_results,
      idTest:      5,
      status:      row.status,
      dateApplied: row.date_applied ?? null,
      notes:       row.notes ?? null,
    });
  }
}

module.exports = getNIHResultUseCase;