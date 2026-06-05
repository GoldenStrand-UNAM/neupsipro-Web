const ReyResultsDTO = require('../../dto/reyDTO');
const { REY_TABLE_RC, REY_TABLE_MCP_MLP, TIME_TABLE } = require('../constants/reyTables');

const SCHOOLING_YEARS_MAP = new Map([
  ['Sin escolaridad', 0],
  ['Primaria', 6],
  ['Secundaria', 9],
  ['Bachillerato', 12],
  ['Licenciatura', 16],
  ['Posgrado', 18],
]);

class postREYUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // ── Age helpers ─────────────────────────────────────────────────────────────

  #calculateAge (birthdate) {
    if (!birthdate) return null;
    const [day, month, year] = String(birthdate).trim().split('/').map(Number);
    if (!day || !month || !year) return null;
    const birth = new Date(year, month - 1, day);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
    return age;
  }

  #resolveSchoolingYears (schooling) {
    return SCHOOLING_YEARS_MAP.has(schooling) ? SCHOOLING_YEARS_MAP.get(schooling) : null;
  }

  #resolveEducationBlock (schoolingYears) {
    if (schoolingYears === null) return null;
    return schoolingYears > 12 ? '>12' : '1-12';
  }

  #resolveAgeRange (age) {
    if (age === null) return null;
    if (age <= 22) return '18-22';
    if (age <= 27) return '23-27';
    if (age <= 32) return '28-32';
    if (age <= 37) return '33-37';
    if (age <= 42) return '38-42';
    if (age <= 47) return '43-47';
    if (age <= 52) return '48-52';
    if (age <= 57) return '53-57';
    if (age <= 62) return '58-62';
    if (age <= 67) return '63-67';
    if (age <= 72) return '68-72';
    if (age <= 77) return '73-77';
    return '>77';
  }

  #resolveTimeAgeKey (age) {
    if (age === null) return null;
    if (age <= 5)  return '5';
    if (age <= 6)  return '6';
    if (age <= 7)  return '7';
    if (age <= 8)  return '8';
    if (age <= 9)  return '9';
    if (age <= 10) return '10';
    if (age <= 11) return '11';
    if (age <= 12) return '12';
    if (age <= 13) return '13';
    if (age <= 14) return '14';
    return '15+';
  }

  // ── Interpolation ───────────────────────────────────────────────────────────

  // Table format: { percentile: score } — higher percentile = higher score.
  #resolveScorePercentile ({ score, educationBlock, ageRange, table }) {
    if (score === null || score === undefined) return null;
    if (!educationBlock || !ageRange)          return null;

    const edBlock = Reflect.get(table ?? {}, educationBlock);
    const column  = edBlock ? Reflect.get(edBlock, ageRange) : null;
    if (!column) return null;

    const entries = Object.entries(column)
      .map(([p, v]) => ({ p: Number(p), v }))
      .sort((a, b) => b.p - a.p);

    if (score >= entries.at(0).v)  return entries.at(0).p;
    if (score <= entries.at(-1).v) return entries.at(-1).p;

    let prev = null;
    for (const curr of entries) {
      if (prev !== null && score <= prev.v && score >= curr.v) {
        const percentile = prev.p + ((score - prev.v) / (curr.v - prev.v)) * (curr.p - prev.p);
        return Math.round(percentile);
      }
      prev = curr;
    }

    return null;
  }

  // Table format: { percentile: time } — lower time = higher percentile.
  #resolveTimePercentile (time, age) {
    if (time === null || time === undefined) return null;

    const ageKey = this.#resolveTimeAgeKey(age);
    if (!ageKey) return null;

    const column = Reflect.get(TIME_TABLE, ageKey);
    if (!column) return null;

    const entries = Object.entries(column)
      .map(([p, t]) => ({ p: Number(p), t }))
      .sort((a, b) => b.p - a.p);

    if (time <= entries.at(0).t)  return entries.at(0).p;
    if (time >= entries.at(-1).t) return entries.at(-1).p;

    let prev = null;
    for (const curr of entries) {
      if (prev !== null && time >= prev.t && time <= curr.t) {
        const percentile = prev.p + ((time - prev.t) / (curr.t - prev.t)) * (curr.p - prev.p);
        return Math.round(percentile);
      }
      prev = curr;
    }

    return null;
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  #parseOptionalScore (value, fieldName) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) {
      const err = new Error(`${fieldName} must be a number between 0 and 100`);
      err.status = 422;
      throw err;
    }
    return parsed;
  }

  #validateAndParseScores ({ score_rc, time_rc, score_mcp, time_mcp, score_mlp, time_mlp, notes }) {
    const scoreRC  = this.#parseOptionalScore(score_rc,  'score_rc');
    const timeRC   = this.#parseOptionalScore(time_rc,   'time_rc');
    const scoreMCP = this.#parseOptionalScore(score_mcp, 'score_mcp');
    const timeMCP  = this.#parseOptionalScore(time_mcp,  'time_mcp');
    const scoreMLP = this.#parseOptionalScore(score_mlp, 'score_mlp');
    const timeMLP  = this.#parseOptionalScore(time_mlp,  'time_mlp');

    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }

    return { scoreRC, timeRC, scoreMCP, timeMCP, scoreMLP, timeMLP };
  }

  async #fetchAndResolveContext ({ id_user, id_application }) {
    const row = await this.impTestResultsRepository.fetchResultRow({ id_user, id_application, id_test: 3 });
    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    const schooling   = await this.impTestResultsRepository.fetchUserSchooling({ id_user });
    const rawAge      = await this.impTestResultsRepository.fetchUserAge({ id_user });

    // uncryptUser devuelve objeto completo — extraer birthdate
    const birthdate   = rawAge?.birthdate ?? rawAge;

    const schoolingYears = this.#resolveSchoolingYears(schooling);
    const age            = this.#calculateAge(birthdate);
    const educationBlock = this.#resolveEducationBlock(schoolingYears);
    const ageRange       = this.#resolveAgeRange(age);

    if (!educationBlock || !ageRange) {
      const err = new Error('Cannot calculate REY percentiles: missing age or schooling data');
      err.status = 422;
      throw err;
    }

    return { row, age, educationBlock, ageRange };
  }

  #calculatePercentiles ({ scoreRC, timeRC, scoreMCP, timeMCP, scoreMLP, timeMLP, educationBlock, ageRange, age }) {
    return {
      pcRC: this.#resolveScorePercentile({ score: scoreRC,  educationBlock, ageRange, table: REY_TABLE_RC }),
      pcTimeRC: this.#resolveTimePercentile(timeRC,  age),
      pcMCP: this.#resolveScorePercentile({ score: scoreMCP, educationBlock, ageRange, table: REY_TABLE_MCP_MLP }),
      pcTimeMCP: this.#resolveTimePercentile(timeMCP, age),
      pcMLP: this.#resolveScorePercentile({ score: scoreMLP, educationBlock, ageRange, table: REY_TABLE_MCP_MLP }),
      pcTimeMLP: this.#resolveTimePercentile(timeMLP, age),
    };
  }

  // ── Execute ─────────────────────────────────────────────────────────────────

  async execute ({ id_user, id_application, score_rc, time_rc, score_mcp, time_mcp, score_mlp, time_mlp, notes }) {
    const scores  = this.#validateAndParseScores({ score_rc, time_rc, score_mcp, time_mcp, score_mlp, time_mlp, notes });
    const context = await this.#fetchAndResolveContext({ id_user, id_application });
    const pcs     = this.#calculatePercentiles({ ...scores, ...context });

    const saved = await this.impTestResultsRepository.saveREYResult({
      id_results: context.row.idResults,
      score_rc: scores.scoreRC,   pc_rc: pcs.pcRC,
      time_rc: scores.timeRC,    pc_time_rc: pcs.pcTimeRC,
      score_mcp: scores.scoreMCP,  pc_mcp: pcs.pcMCP,
      time_mcp: scores.timeMCP,   pc_time_mcp: pcs.pcTimeMCP,
      score_mlp: scores.scoreMLP,  pc_mlp: pcs.pcMLP,
      time_mlp: scores.timeMLP,   pc_time_mlp: pcs.pcTimeMLP,
      notes: notes ?? null,
    });

    return new ReyResultsDTO({
      idResults: context.row.idResults,
      idTest: 3,
      status: 3,
      dateApplied: saved.date_applied ?? null,
      rc: { score: saved.score_rc,  pc: saved.pc_rc,  time: saved.time_rc,  pcTime: saved.pc_time_rc  },
      mcp: { score: saved.score_mcp, pc: saved.pc_mcp, time: saved.time_mcp, pcTime: saved.pc_time_mcp },
      mlp: { score: saved.score_mlp, pc: saved.pc_mlp, time: saved.time_mlp, pcTime: saved.pc_time_mlp },
      notes: saved.notes ?? null,
    });
  }
}

module.exports = postREYUseCase;
