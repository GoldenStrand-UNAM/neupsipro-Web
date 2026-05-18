const ReyResultsDTO = require('../../dto/reyDTO');
const { REY_TABLE_RC, REY_TABLE_MCP_MLP, TIME_TABLE } = require('../../constants/reyTables');

class postREYUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // ── Age helpers ─────────────────────────────────────────────────────────────

  // Calculates age in years from a birthdate string.
  #calculateAge (birthdate) {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  // Maps schooling label to years of education.
  #resolveSchoolingYears (schooling) {
    const map = {
      'Sin escolaridad': 0,
      'Primaria':        6,
      'Secundaria':      9,
      'Bachillerato':    12,
      'Licenciatura':    16,
      'Posgrado':        18,
    };
    return map[schooling] ?? null;
  }

  // Returns '>12' or '1-12' education block.
  #resolveEducationBlock (schoolingYears) {
    if (schoolingYears === null) return null;
    return schoolingYears > 12 ? '>12' : '1-12';
  }

  // Maps age to normative age range string.
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

  // Maps age to TIME_TABLE key string.
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

  // Resolves percentile for a score using linear interpolation.
  // Table format: { percentile: score } — higher percentile = higher score.
  // Returns null if score or table is missing.
  #resolveScorePercentile (score, educationBlock, ageRange, table) {
    if (score === null || score === undefined) return null;
    if (!educationBlock || !ageRange)          return null;

    const column = table?.[educationBlock]?.[ageRange];
    if (!column) return null;

    // Sort entries descending by percentile (highest first)
    const entries = Object.entries(column)
      .map(([p, v]) => ({ p: Number(p), v }))
      .sort((a, b) => b.p - a.p);

    const maxEntry = entries[0];
    const minEntry = entries[entries.length - 1];

    // Score above or equal to max score → max percentile
    if (score >= maxEntry.v) return maxEntry.p;

    // Score below or equal to min score → min percentile
    if (score <= minEntry.v) return minEntry.p;

    // Find the two neighbors surrounding the score
    // entries are sorted descending by percentile so scores are descending too
    for (let i = 0; i < entries.length - 1; i++) {
      const upper = entries[i];     // higher percentile, higher score
      const lower = entries[i + 1]; // lower percentile, lower score

      if (score <= upper.v && score >= lower.v) {
        // Linear interpolation
        const percentile = upper.p +
          ((score - upper.v) / (lower.v - upper.v)) * (lower.p - upper.p);
        return Math.round(percentile);
      }
    }

    return null;
  }

  // Resolves percentile for a time using linear interpolation.
  // Table format: { percentile: time } — lower time = higher percentile.
  // Returns null if time or table is missing.
  #resolveTimePercentile (time, age) {
    if (time === null || time === undefined) return null;

    const ageKey = this.#resolveTimeAgeKey(age);
    if (!ageKey) return null;

    const column = TIME_TABLE[ageKey];
    if (!column) return null;

    // Sort entries descending by percentile (highest first = lowest time)
    const entries = Object.entries(column)
      .map(([p, t]) => ({ p: Number(p), t }))
      .sort((a, b) => b.p - a.p);

    const bestEntry  = entries[0];                    // highest percentile, lowest time
    const worstEntry = entries[entries.length - 1];   // lowest percentile, highest time

    // Time faster than best → best percentile
    if (time <= bestEntry.t)  return bestEntry.p;

    // Time slower than worst → worst percentile
    if (time >= worstEntry.t) return worstEntry.p;

    // Find neighbors — entries sorted desc by percentile means asc by time
    for (let i = 0; i < entries.length - 1; i++) {
      const faster = entries[i];     // higher percentile, lower time
      const slower = entries[i + 1]; // lower percentile, higher time

      if (time >= faster.t && time <= slower.t) {
        // Linear interpolation — time inverse: more time = less percentile
        const percentile = faster.p +
          ((time - faster.t) / (slower.t - faster.t)) * (slower.p - faster.p);
        return Math.round(percentile);
      }
    }

    return null;
  }

  // ── Validation ──────────────────────────────────────────────────────────────

  #parseOptionalScore (value, fieldName) {
    if (value === undefined || value === null || value === '') return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      const err = new Error(`${fieldName} must be a non-negative number`);
      err.status = 422;
      throw err;
    }
    return parsed;
  }

  // ── Execute ─────────────────────────────────────────────────────────────────

  async execute ({
    id_user, id_application,
    score_rc,  time_rc,
    score_mcp, time_mcp,
    score_mlp, time_mlp,
    notes,
  }) {

    // 1. Parse and validate all scores and times — all optional
    const scoreRC  = this.#parseOptionalScore(score_rc,  'score_rc');
    const timeRC   = this.#parseOptionalScore(time_rc,   'time_rc');
    const scoreMCP = this.#parseOptionalScore(score_mcp, 'score_mcp');
    const timeMCP  = this.#parseOptionalScore(time_mcp,  'time_mcp');
    const scoreMLP = this.#parseOptionalScore(score_mlp, 'score_mlp');
    const timeMLP  = this.#parseOptionalScore(time_mlp,  'time_mlp');

    // 2. Validate notes length if provided
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }

    // 3. Verify result row exists
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 3,
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 4. Fetch schooling and age server-side — never trust the client
    const schooling = await this.impTestResultsRepository.fetchUserSchooling({ id_user });
    const birthdate = await this.impTestResultsRepository.fetchUserAge({ id_user });

    const schoolingYears   = this.#resolveSchoolingYears(schooling);
    const age              = this.#calculateAge(birthdate);
    const educationBlock   = this.#resolveEducationBlock(schoolingYears);
    const ageRange         = this.#resolveAgeRange(age);

    // 5. Both are required to calculate percentiles
    if (!educationBlock || !ageRange) {
      const err = new Error('Cannot calculate REY percentiles: missing age or schooling data');
      err.status = 422;
      throw err;
    }

    // 6. Calculate all percentiles server-side via interpolation
    const pcRC      = this.#resolveScorePercentile(scoreRC,  educationBlock, ageRange, REY_TABLE_RC);
    const pcTimeRC  = this.#resolveTimePercentile(timeRC,  age);
    const pcMCP     = this.#resolveScorePercentile(scoreMCP, educationBlock, ageRange, REY_TABLE_MCP_MLP);
    const pcTimeMCP = this.#resolveTimePercentile(timeMCP, age);
    const pcMLP     = this.#resolveScorePercentile(scoreMLP, educationBlock, ageRange, REY_TABLE_MCP_MLP);
    const pcTimeMLP = this.#resolveTimePercentile(timeMLP, age);

    // 7. Persist
    const saved = await this.impTestResultsRepository.saveREYResult({
      id_results:  row.idResults,
      score_rc:    scoreRC,  pc_rc:      pcRC,
      time_rc:     timeRC,   pc_time_rc: pcTimeRC,
      score_mcp:   scoreMCP, pc_mcp:     pcMCP,
      time_mcp:    timeMCP,  pc_time_mcp: pcTimeMCP,
      score_mlp:   scoreMLP, pc_mlp:     pcMLP,
      time_mlp:    timeMLP,  pc_time_mlp: pcTimeMLP,
      notes:       notes ?? null,
    });

    // 8. Map to DTO
    return new ReyResultsDTO({
      idResults:   row.idResults,
      idTest:      3,
      status:      3,
      dateApplied: saved.date_applied ?? null,
      rc:  { score: saved.score_rc,  pc: saved.pc_rc,  time: saved.time_rc,  pcTime: saved.pc_time_rc  },
      mcp: { score: saved.score_mcp, pc: saved.pc_mcp, time: saved.time_mcp, pcTime: saved.pc_time_mcp },
      mlp: { score: saved.score_mlp, pc: saved.pc_mlp, time: saved.time_mlp, pcTime: saved.pc_time_mlp },
      notes: saved.notes ?? null,
    });
  }
}

module.exports = postREYUseCase;