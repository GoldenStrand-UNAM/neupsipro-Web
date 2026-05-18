/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

// ── Normative tables (client-side mirror for live display) ───────────────────
// These are read-only copies — server always recalculates on save.

const REY_TABLE_RC = {
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

const REY_TABLE_MCP_MLP = {
  '>12': {
    '18-22': { 95: 36.0, 90: 33.8, 85: 32.2, 80: 30.8, 70: 28.7, 60: 26.8, 50: 25.1, 40: 23.5, 30: 21.6, 20: 19.5, 15: 18.1, 10: 16.5, 5: 14.1 },
    '23-27': { 95: 36.0, 90: 33.0, 85: 31.4, 80: 30.0, 70: 27.9, 60: 26.1, 50: 24.4, 40: 22.7, 30: 20.9, 20: 18.7, 15: 17.3, 10: 15.7, 5: 13.3 },
    '28-32': { 95: 34.7, 90: 32.2, 85: 30.6, 80: 29.3, 70: 27.1, 60: 25.3, 50: 23.6, 40: 21.9, 30: 20.1, 20: 17.9, 15: 16.6, 10: 14.9, 5: 12.5 },
    '33-37': { 95: 33.9, 90: 31.4, 85: 29.8, 80: 28.5, 70: 26.3, 60: 24.5, 50: 22.8, 40: 21.1, 30: 19.3, 20: 17.1, 15: 15.8, 10: 14.2, 5: 11.7 },
    '38-42': { 95: 33.1, 90: 30.7, 85: 29.0, 80: 27.7, 70: 25.5, 60: 23.7, 50: 22.0, 40: 20.3, 30: 18.5, 20: 16.4, 15: 15.0, 10: 13.4, 5: 11.0 },
    '43-47': { 95: 32.3, 90: 29.9, 85: 28.3, 80: 26.9, 70: 24.8, 60: 22.9, 50: 21.2, 40: 19.6, 30: 17.7, 20: 15.6, 15: 14.2, 10: 12.6, 5: 10.2 },
    '48-52': { 95: 31.5, 90: 29.1, 85: 27.5, 80: 26.1, 70: 24.0, 60: 22.2, 50: 20.5, 40: 18.8, 30: 17.0, 20: 14.8, 15: 13.4, 10: 11.8, 5: 9.4  },
    '53-57': { 95: 30.8, 90: 28.3, 85: 26.7, 80: 25.4, 70: 23.2, 60: 21.4, 50: 19.7, 40: 18.0, 30: 16.2, 20: 14.0, 15: 12.7, 10: 11.0, 5: 8.6  },
    '58-62': { 95: 30.0, 90: 27.5, 85: 25.9, 80: 24.6, 70: 22.4, 60: 20.6, 50: 18.9, 40: 17.2, 30: 15.4, 20: 13.2, 15: 11.9, 10: 10.3, 5: 7.8  },
    '63-67': { 95: 29.2, 90: 26.8, 85: 25.1, 80: 23.8, 70: 21.6, 60: 19.8, 50: 18.1, 40: 16.4, 30: 14.6, 20: 12.5, 15: 11.1, 10: 9.5,  5: 7.1  },
    '68-72': { 95: 28.4, 90: 26.0, 85: 24.4, 80: 23.0, 70: 20.9, 60: 19.0, 50: 17.3, 40: 15.7, 30: 13.8, 20: 11.7, 15: 10.3, 10: 8.7,  5: 6.3  },
    '73-77': { 95: 27.6, 90: 25.2, 85: 23.6, 80: 22.2, 70: 20.1, 60: 18.3, 50: 16.6, 40: 14.9, 30: 13.1, 20: 10.9, 15: 9.6,  10: 7.9,  5: 5.5  },
    '>77':   { 95: 26.9, 90: 24.4, 85: 22.8, 80: 21.5, 70: 19.3, 60: 17.5, 50: 15.8, 40: 14.1, 30: 12.3, 20: 10.1, 15: 8.8,  10: 7.2,  5: 4.7  },
  },
  '1-12': {
    '18-22': { 95: 33.1, 90: 30.7, 85: 29.0, 80: 27.7, 70: 25.5, 60: 23.7, 50: 22.0, 40: 20.3, 30: 18.5, 20: 16.4, 15: 15.0, 10: 13.4, 5: 11.0 },
    '23-27': { 95: 32.3, 90: 29.9, 85: 28.3, 80: 26.9, 70: 24.8, 60: 22.9, 50: 21.2, 40: 19.6, 30: 17.7, 20: 15.6, 15: 14.2, 10: 12.6, 5: 10.2 },
    '28-32': { 95: 31.5, 90: 29.1, 85: 27.5, 80: 26.1, 70: 24.0, 60: 22.2, 50: 20.5, 40: 18.8, 30: 17.0, 20: 14.8, 15: 13.4, 10: 11.8, 5: 9.4  },
    '33-37': { 95: 30.8, 90: 28.3, 85: 26.7, 80: 25.4, 70: 23.2, 60: 21.4, 50: 19.7, 40: 18.0, 30: 16.2, 20: 14.0, 15: 12.7, 10: 11.0, 5: 8.6  },
    '38-42': { 95: 30.0, 90: 27.5, 85: 25.9, 80: 24.6, 70: 22.4, 60: 20.6, 50: 18.9, 40: 17.2, 30: 15.4, 20: 13.2, 15: 11.9, 10: 10.3, 5: 7.8  },
    '43-47': { 95: 29.2, 90: 26.8, 85: 25.1, 80: 23.8, 70: 21.6, 60: 19.8, 50: 18.1, 40: 16.4, 30: 14.6, 20: 12.5, 15: 11.1, 10: 9.5,  5: 7.1  },
    '48-52': { 95: 28.4, 90: 26.0, 85: 24.4, 80: 23.0, 70: 20.9, 60: 19.0, 50: 17.4, 40: 15.7, 30: 13.8, 20: 11.7, 15: 10.3, 10: 8.7,  5: 6.3  },
    '53-57': { 95: 27.6, 90: 25.2, 85: 23.6, 80: 22.2, 70: 20.1, 60: 18.3, 50: 16.6, 40: 14.9, 30: 13.1, 20: 10.9, 15: 9.6,  10: 7.9,  5: 5.5  },
    '58-62': { 95: 26.9, 90: 24.4, 85: 22.8, 80: 21.5, 70: 19.3, 60: 17.5, 50: 15.8, 40: 14.1, 30: 12.3, 20: 10.1, 15: 8.8,  10: 7.2,  5: 4.7  },
    '63-67': { 95: 26.1, 90: 23.7, 85: 22.0, 80: 20.7, 70: 18.5, 60: 16.7, 50: 15.0, 40: 13.3, 20: 9.3,  15: 8.0,  10: 6.4,  5: 3.9   },
    '68-72': { 95: 25.3, 90: 22.9, 85: 21.3, 80: 19.9, 70: 17.7, 60: 15.9, 50: 14.2, 40: 12.5, 30: 10.7, 20: 8.6,  15: 7.2,  10: 5.6,  5: 3.2  },
    '73-77': { 95: 24.5, 90: 22.1, 85: 20.5, 80: 19.1, 70: 17.0, 60: 15.1, 50: 13.5, 40: 11.8, 30: 9.9,  20: 7.8,  15: 6.4,  10: 4.8,  5: 2.4  },
    '>77':   { 95: 23.7, 90: 21.3, 85: 19.7, 80: 18.3, 70: 16.2, 60: 14.4, 50: 12.7, 40: 11.0, 30: 9.2,  20: 7.0,  15: 5.7,  10: 4.0,  5: 1.6  },
  },
};

const REY_TIME_TABLE = {
  '5':   { 99: 4, 75: 5, 50: 6, 25: 9,  10: 10 },
  '6':   { 99: 4, 75: 5, 50: 6, 25: 8,  10: 10 },
  '7':   { 99: 4, 75: 6, 50: 7, 25: 9,  10: 10 },
  '8':   { 99: 4, 75: 6, 50: 7, 25: 8,  10: 9  },
  '9':   { 99: 4, 75: 6, 50: 7, 25: 8,  10: 9  },
  '10':  { 99: 4, 75: 5, 50: 7, 25: 8,  10: 9  },
  '11':  { 99: 3, 75: 4, 50: 5, 25: 6,  10: 7  },
  '12':  { 99: 3,         50: 4, 25: 5,  10: 7  },
  '13':  { 99: 2,         50: 3, 25: 4,  10: 6  },
  '14':  { 99: 2, 75: 3, 50: 4, 25: 5,  10: 6  },
  '15+': { 99: 1, 75: 2, 50: 3, 25: 4,  10: 5  },
};

// ── Client-side helpers ───────────────────────────────────────────────────────
// Mirror of server-side logic — used only for live display, never trusted.

function reyResolveEducationBlock (schoolingYears) {
  if (schoolingYears === null || schoolingYears === undefined) return null;
  return schoolingYears > 12 ? '>12' : '1-12';
}

function reyResolveAgeRange (age) {
  if (age === null || age === undefined) return null;
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

function reyResolveTimeAgeKey (age) {
  if (age === null || age === undefined) return null;
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

// Linear interpolation for score percentile.
// table format: { percentile: score } — higher percentile = higher score.
function reyResolveScorePercentile (score, educationBlock, ageRange, table) {
  if (score === null || score === undefined || score === '') return null;
  if (!educationBlock || !ageRange) return null;

  const column = table?.[educationBlock]?.[ageRange];
  if (!column) return null;

  const entries = Object.entries(column)
    .map(([p, v]) => ({ p: Number(p), v }))
    .sort((a, b) => b.p - a.p);

  const maxEntry = entries[0];
  const minEntry = entries[entries.length - 1];

  if (score >= maxEntry.v) return maxEntry.p;
  if (score <= minEntry.v) return minEntry.p;

  for (let i = 0; i < entries.length - 1; i++) {
    const upper = entries[i];
    const lower = entries[i + 1];
    if (score <= upper.v && score >= lower.v) {
      const percentile = upper.p +
        ((score - upper.v) / (lower.v - upper.v)) * (lower.p - upper.p);
      return Math.round(percentile);
    }
  }
  return null;
}

// Linear interpolation for time percentile.
// Lower time = higher percentile.
function reyResolveTimePercentile (time, age) {
  if (time === null || time === undefined || time === '') return null;

  const ageKey = reyResolveTimeAgeKey(age);
  if (!ageKey) return null;

  const column = REY_TIME_TABLE[ageKey];
  if (!column) return null;

  const entries = Object.entries(column)
    .map(([p, t]) => ({ p: Number(p), t }))
    .sort((a, b) => b.p - a.p);

  const bestEntry  = entries[0];
  const worstEntry = entries[entries.length - 1];

  if (time <= bestEntry.t)  return bestEntry.p;
  if (time >= worstEntry.t) return worstEntry.p;

  for (let i = 0; i < entries.length - 1; i++) {
    const faster = entries[i];
    const slower = entries[i + 1];
    if (time >= faster.t && time <= slower.t) {
      const percentile = faster.p +
        ((time - faster.t) / (slower.t - faster.t)) * (slower.p - faster.p);
      return Math.round(percentile);
    }
  }
  return null;
}

// ── CONSULT REY VIEW ─────────────────────────────────────────────────────────────
// Read-only view of a graded REY result.
// Three independent areas: RC (copy), MCp (short-term), MLp (long-term).

function buildREYConsultHTML (test) {
  const notes = test.notes ?? '';

  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—';

  // Reusable area section — score, percentile, time, time percentile
  function areaSection (title, area) {
    return `
      <div class="flex flex-col gap-3 py-5 border-b border-gray-200">

        <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          ${title}
        </h3>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Puntuación</span>
            <span class="text-base text-gray-900 font-medium">
              ${area?.score ?? '—'}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Percentil</span>
            <span class="text-base text-gray-900 font-medium">
              ${area?.pc ?? '—'}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Tiempo (min)</span>
            <span class="text-base text-gray-900 font-medium">
              ${area?.time ?? '—'}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Pc Tiempo</span>
            <span class="text-base text-gray-900 font-medium">
              ${area?.pcTime ?? '—'}
            </span>
          </div>

        </div>
      </div>`;
  }

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">REY</h2>
        <button id="btnCloseREY" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col">

        <!-- Fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Fecha:</span>
          <span class="text-base sm:text-lg text-gray-900">${dateLabel}</span>
        </div>

        ${areaSection('R-C — Copia',               test.rc)}
        ${areaSection('R-MCp — Memoria Corto Plazo', test.mcp)}
        ${areaSection('R-MLp — Memoria Largo Plazo', test.mlp)}

        <!-- Notas -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-all whitespace-pre-wrap">
            ${notes ? escapeHTML(notes) : '—'}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelREY"
            class="flex items-center gap-3 px-6 py-3
                   border border-gray-300 rounded-2xl
                   text-base hover:bg-gray-50 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Cerrar
          </button>
        </div>

      </div>
    </div>`;
}