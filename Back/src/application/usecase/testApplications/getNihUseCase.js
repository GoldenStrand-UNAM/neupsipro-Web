const NihResultsDTO = require('../../dto/nihResultsDTO');

class getNihResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the Nih result row
    const row = await this.impTestResultsRepository.fetchNihResult({ id_results });

    if (!row) {
      const err = new Error('Nih result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new NihResultsDTO({
      idResults: row.id_results,
      idTest: 5,
      status: row.status,
      dateApplied: row.date_applied ?? null,
      notes: row.notes ?? null,
    });
  }
}

module.exports = getNihResultUseCase;
