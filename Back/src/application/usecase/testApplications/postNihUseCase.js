const NihResultsDTO = require('../../dto/nihResultsDTO');

class postNihUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // Saves Nih notes and updates status to 3 (Calificada).
  // Nih has no score or interpretation — only free-text notes.
  async execute ({ id_user, id_application, notes }) {

    // 1. Validate notes length
    if (notes && String(notes).length > 500) {
      const err = new Error('notes must be 500 characters or less');
      err.status = 422;
      throw err;
    }

    // 2. Verify result row exists for this user, application and test
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 5,
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 3. Persist into Nih_results
    const saved = await this.impTestResultsRepository.saveNihResult({
      id_results: row.idResults,
      notes: notes ?? null,
    });

    // 4. Map to DTO — never expose raw DB row across boundaries
    return new NihResultsDTO({
      idResults: row.idResults,
      idTest: 5,
      status: 3,
      dateApplied: saved.date_applied ?? null,
      notes: saved.notes ?? null,
    });
  }
}

module.exports = postNihUseCase;
