const ReyResultsDTO = require('../../dto/reyDTO');

class getREYResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    // 1. Fetch the REY result row
    const row = await this.impTestResultsRepository.fetchREYResult({ id_results });

    if (!row) {
      const err = new Error('REY result not found');
      err.status = 404;
      throw err;
    }

    // 2. Map to DTO — never expose raw DB row across boundaries
    return new ReyResultsDTO({
      idResults: row.id_results,
      idTest: 3,
      status: row.status,
      dateApplied: row.date_applied ?? null,
      rc: {
        score: row.score_rc  ?? null,
        pc: row.pc_rc     ?? null,
        time: row.time_rc   ?? null,
        pcTime: row.pc_time_rc ?? null,
      },
      mcp: {
        score: row.score_mcp  ?? null,
        pc: row.pc_mcp     ?? null,
        time: row.time_mcp   ?? null,
        pcTime: row.pc_time_mcp ?? null,
      },
      mlp: {
        score: row.score_mlp  ?? null,
        pc: row.pc_mlp     ?? null,
        time: row.time_mlp   ?? null,
        pcTime: row.pc_time_mlp ?? null,
      },
      notes: row.notes ?? null,
    });
  }
}

module.exports = getREYResultUseCase;
