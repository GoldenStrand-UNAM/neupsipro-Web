// Normative table ROCF Mexico (Table A8)
// Keys: education block → age range → { percentile: scoreValue }
const REY_TABLE = {
  '>12': {
    '18-22': { 60: 36.0, 50: 34.9, 40: 33.4, 30: 31.8, 20: 29.9, 15: 28.7, 10: 27.2, 5: 25.1 },
    '23-27': { 60: 36.0, 50: 34.5, 40: 33.0, 30: 31.4, 20: 29.5, 15: 28.3, 10: 26.8, 5: 24.7 },
    '28-32': { 70: 36.0, 60: 35.6, 50: 34.1, 40: 32.6, 30: 31.0, 20: 29.1, 15: 27.9, 10: 26.4, 5: 24.3 },
    '33-37': { 70: 36.0, 60: 35.2, 50: 33.7, 40: 32.2, 30: 30.6, 20: 28.7, 15: 27.5, 10: 26.0, 5: 23.9 },
    '38-42': { 70: 36.0, 60: 34.8, 50: 33.3, 40: 31.8, 30: 30.2, 20: 28.3, 15: 27.1, 10: 25.6, 5: 23.5 },
    '43-47': { 70: 36.0, 60: 34.4, 50: 32.9, 40: 31.4, 30: 29.8, 20: 27.8, 15: 26.6, 10: 25.2, 5: 23.1 },
    '48-52': { 80: 36.0, 70: 35.6, 60: 34.0, 50: 32.5, 40: 31.0, 30: 29.4, 20: 27.4, 15: 26.2, 10: 24.8, 5: 22.6 },
    '53-57': { 80: 36.0, 70: 35.2, 60: 33.6, 50: 32.1, 40: 30.6, 30: 29.0, 20: 27.0, 15: 25.8, 10: 24.4, 5: 22.2 },
    '58-62': { 80: 36.0, 70: 34.8, 60: 33.2, 50: 31.7, 40: 30.2, 30: 28.6, 20: 26.6, 15: 25.4, 10: 24.0, 5: 21.8 },
    '63-67': { 80: 36.0, 70: 34.4, 60: 32.8, 50: 31.3, 40: 29.8, 30: 28.1, 20: 26.2, 15: 25.0, 10: 23.6, 5: 21.4 },
    '68-72': { 85: 36.0, 80: 35.9, 70: 34.0, 60: 32.4, 50: 30.9, 40: 29.4, 30: 27.7, 20: 25.8, 15: 24.6, 10: 23.2, 5: 21.0 },
    '73-77': { 85: 36.0, 80: 35.5, 70: 33.6, 60: 32.0, 50: 30.5, 40: 29.0, 30: 27.3, 20: 25.4, 15: 24.2, 10: 22.8, 5: 20.6 },
    '>77':   { 85: 36.0, 80: 35.1, 70: 33.2, 60: 31.5, 50: 30.0, 40: 28.6, 30: 26.9, 20: 25.0, 15: 23.8, 10: 22.4, 5: 20.2 },
  },
  '1-12': {
    '18-22': { 80: 36.0, 70: 35.8, 60: 34.2, 50: 32.7, 40: 31.2, 30: 29.6, 20: 27.7, 15: 26.5, 10: 25.0, 5: 22.9 },
    '23-27': { 80: 36.0, 70: 35.4, 60: 33.8, 50: 32.3, 40: 30.8, 30: 29.2, 20: 27.3, 15: 26.1, 10: 24.6, 5: 22.5 },
    '28-32': { 80: 36.0, 70: 35.0, 60: 33.4, 50: 31.9, 40: 30.4, 30: 28.8, 20: 26.9, 15: 25.7, 10: 24.2, 5: 22.1 },
    '33-37': { 80: 36.0, 70: 34.6, 60: 33.0, 50: 31.5, 40: 30.0, 30: 28.4, 20: 26.5, 15: 25.3, 10: 23.8, 5: 21.7 },
    '38-42': { 80: 36.0, 70: 34.2, 60: 32.6, 50: 31.1, 40: 29.6, 30: 28.0, 20: 26.1, 15: 24.9, 10: 23.4, 5: 21.3 },
    '43-47': { 85: 36.0, 80: 35.7, 70: 33.8, 60: 32.2, 50: 30.7, 40: 29.2, 30: 27.6, 20: 25.7, 15: 24.5, 10: 23.0, 5: 20.9 },
    '48-52': { 85: 36.0, 80: 35.3, 70: 33.4, 60: 31.8, 50: 30.3, 40: 28.8, 30: 27.2, 20: 25.2, 15: 24.1, 10: 22.6, 5: 20.5 },
    '53-57': { 85: 36.0, 80: 34.9, 70: 33.0, 60: 31.4, 50: 29.9, 40: 28.4, 30: 26.8, 20: 24.8, 15: 23.6, 10: 22.2, 5: 20.0 },
    '58-62': { 90: 36.0, 85: 35.7, 80: 34.5, 70: 32.6, 60: 31.0, 50: 29.5, 40: 28.0, 30: 26.4, 20: 24.4, 15: 23.2, 10: 21.8, 5: 19.6 },
    '63-67': { 90: 36.0, 85: 35.3, 80: 34.1, 70: 32.2, 60: 30.6, 50: 29.1, 40: 27.6, 30: 26.0, 20: 24.0, 15: 22.8, 10: 21.4, 5: 19.2 },
    '68-72': { 90: 36.0, 85: 34.9, 80: 33.7, 70: 31.8, 60: 30.2, 50: 28.7, 40: 27.2, 30: 25.5, 20: 23.6, 15: 22.4, 10: 21.0, 5: 18.8 },
    '73-77': { 95: 36.0, 90: 35.9, 85: 34.5, 80: 33.3, 70: 31.4, 60: 29.8, 50: 28.3, 40: 26.8, 30: 25.1, 20: 23.2, 15: 22.0, 10: 20.6, 5: 18.4 },
    '>77':   { 95: 36.0, 90: 35.5, 85: 34.1, 80: 32.9, 70: 31.0, 60: 29.4, 50: 27.9, 40: 26.4, 30: 24.7, 20: 22.8, 15: 21.6, 10: 20.2, 5: 18.0 },
  },
};

class postREYUseCase {
  constructor(impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  // Calculate age in years from a birthdate
  calculateAge(birthdate) {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
    return years;
  }

  // Map age in years to the table's age range key
  resolveAgeRange(age) {
    if (age >= 18 && age <= 22) return '18-22';
    if (age >= 23 && age <= 27) return '23-27';
    if (age >= 28 && age <= 32) return '28-32';
    if (age >= 33 && age <= 37) return '33-37';
    if (age >= 38 && age <= 42) return '38-42';
    if (age >= 43 && age <= 47) return '43-47';
    if (age >= 48 && age <= 52) return '48-52';
    if (age >= 53 && age <= 57) return '53-57';
    if (age >= 58 && age <= 62) return '58-62';
    if (age >= 63 && age <= 67) return '63-67';
    if (age >= 68 && age <= 72) return '68-72';
    if (age >= 73 && age <= 77) return '73-77';
    if (age > 77) return '>77';
    return null; // under 18 — not covered by table
  }

  // Map schooling years to education block key
  resolveEducationBlock(schoolingYears) {
    if (schoolingYears === null) return null;
    return schoolingYears > 12 ? '>12' : '1-12';
  }

  // Map schooling label to years (mirrors MoCA logic)
  resolveSchoolingYears(schooling) {
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

    /**
   * Logic:
   * - percentiles are sorted descending in the table (95 → 5)
   * - find the exact percentile row if it exists
   * - if the percentile entered is above the highest available → use highest available score
   * - if the percentile entered is below 5 → use lowest available score
   * - if between two rows → interpolate linearly
   */
  resolveNormativeScore(percentile, educationBlock, ageRange) {
    const column = REY_TABLE[educationBlock]?.[ageRange];
    if (!column) return null;

    // Sort percentiles descending (95, 90, 85 ...)
    const percentiles = Object.keys(column)
      .map(Number)
      .sort((a, b) => b - a);

    const maxPercentile = percentiles[0];
    const minPercentile = percentiles[percentiles.length - 1];

    // Exact match
    if (column[percentile] !== undefined) return column[percentile];

    // Above the highest available percentile
    if (percentile > maxPercentile) return column[maxPercentile];

    // Below the lowest available percentile
    if (percentile < minPercentile) return column[minPercentile];

    // Linear interpolation between two surrounding percentiles
    let upper = null;
    let lower = null;

    for (let i = 0; i < percentiles.length - 1; i++) {
      if (percentiles[i] > percentile && percentiles[i + 1] < percentile) {
        upper = percentiles[i];
        lower = percentiles[i + 1];
        break;
      }
    }

    if (upper === null || lower === null) return null;

    const upperScore = column[upper];
    const lowerScore = column[lower];

    // Linear interpolation formula
    const interpolated = lowerScore +
      ((percentile - lower) / (upper - lower)) * (upperScore - lowerScore);

    return Math.round(interpolated * 10) / 10; // round to 1 decimal
  }

  /**
   * Main execute method.
   * score       = percentile entered by clinician (0–95)
   * interpretation = normative score looked up from table (0–36)
   */
  async execute({ id_user, id_application, score, notes }) {

    // 1. Validate percentile (score field)
    const percentile = Number(score);
    if (score === undefined || score === null || score === '' || isNaN(percentile)) {
      const err = new Error('score must be a valid number');
      err.status = 422;
      throw err;
    }

    if (percentile < 0 || percentile > 95) {
      const err = new Error('score (percentile) must be between 0 and 95');
      err.status = 422;
      throw err;
    }

    // 2. Validate notes
    if (notes && String(notes).length > 200) {
      const err = new Error('notes must be 200 characters or less');
      err.status = 422;
      throw err;
    }

    // 3. Verify result row exists
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 3, // REY is id_test = 3
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 4. Fetch schooling and birthdate to determine table lookup keys
    const schooling      = await this.impTestResultsRepository.fetchUserSchooling({ id_user });
    const birthdate      = await this.impTestResultsRepository.fetchUserAge({ id_user });

    const schoolingYears  = this.resolveSchoolingYears(schooling);
    const educationBlock  = this.resolveEducationBlock(schoolingYears);
    const ageYears        = this.calculateAge(birthdate);
    const ageRange        = this.resolveAgeRange(ageYears);

    if (!educationBlock || !ageRange) {
      const err = new Error(
        'Cannot calculate REY score: missing age or schooling data for this user'
      );
      err.status = 422;
      throw err;
    }

    // 5. Look up normative score from table
    const normativeScore = this.resolveNormativeScore(percentile, educationBlock, ageRange);

    if (normativeScore === null) {
      const err = new Error('Could not resolve normative score from table');
      err.status = 422;
      throw err;
    }

    // 6. Persist
    // score          = percentile entered by clinician
    // interpretation = normative score from table (string for VARCHAR column)
    const updated = await this.impTestResultsRepository.saveResult({
      id_results:     row.idResults,
      score:          percentile,
      interpretation: String(normativeScore),
      notes:          notes ?? null,
    });

    return {
      idResults:      updated.idResults,
      idTest:         updated.idTest,
      testName:       updated.testName,
      status:         updated.status,
      score:          updated.score,
      interpretation: updated.interpretation,
      dateApplied:    updated.dateApplied,
      notes:          updated.notes,
    };
  }
}

module.exports = postREYUseCase;