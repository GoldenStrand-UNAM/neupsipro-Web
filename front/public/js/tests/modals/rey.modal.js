/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */
/* global buildModalFormActions, buildModalConsultActions, setModalSaveBusy */

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
    '>77': { 85: 36.0, 80: 35.1, 70: 33.2, 60: 31.5, 50: 30.0, 40: 28.6, 30: 26.9, 20: 25.0, 15: 23.8, 10: 22.4, 5: 20.2 },
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
    '>77': { 95: 36.0, 90: 35.5, 85: 34.1, 80: 32.9, 70: 31.0, 60: 29.4, 50: 27.9, 40: 26.4, 30: 24.7, 20: 22.8, 15: 21.6, 10: 20.2, 5: 18.0 },
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
    '>77': { 95: 26.9, 90: 24.4, 85: 22.8, 80: 21.5, 70: 19.3, 60: 17.5, 50: 15.8, 40: 14.1, 30: 12.3, 20: 10.1, 15: 8.8,  10: 7.2,  5: 4.7  },
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
    '>77': { 95: 23.7, 90: 21.3, 85: 19.7, 80: 18.3, 70: 16.2, 60: 14.4, 50: 12.7, 40: 11.0, 30: 9.2,  20: 7.0,  15: 5.7,  10: 4.0,  5: 1.6  },
  },
};

const REY_TIME_TABLE = {
  '5': { 99: 4, 75: 5, 50: 6, 25: 9,  10: 10 },
  '6': { 99: 4, 75: 5, 50: 6, 25: 8,  10: 10 },
  '7': { 99: 4, 75: 6, 50: 7, 25: 9,  10: 10 },
  '8': { 99: 4, 75: 6, 50: 7, 25: 8,  10: 9  },
  '9': { 99: 4, 75: 6, 50: 7, 25: 8,  10: 9  },
  '10': { 99: 4, 75: 5, 50: 7, 25: 8,  10: 9  },
  '11': { 99: 3, 75: 4, 50: 5, 25: 6,  10: 7  },
  '12': { 99: 3,         50: 4, 25: 5,  10: 7  },
  '13': { 99: 2,         50: 3, 25: 4,  10: 6  },
  '14': { 99: 2, 75: 3, 50: 4, 25: 5,  10: 6  },
  '15+': { 99: 1, 75: 2, 50: 3, 25: 4,  10: 5  },
};

// ── Client-side helpers ───────────────────────────────────────────────────────
// Mirrors the server-side logic — only used for live preview, never trusted for scoring.

// Returns '>12' or '1-12' based on years of schooling.
function reyResolveEducationBlock (schoolingYears) {
  if (schoolingYears === null || schoolingYears === undefined) return null;
  return schoolingYears > 12 ? '>12' : '1-12';
}

// Maps age in years to its normative age group string (e.g. 25 → '23-27').
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

// Maps age to the key used in the time table (used for children's norms).
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

// Looks up the percentile for a score in the normative table.
// Higher score → higher percentile. Interpolates between table entries.
function reyResolveScorePercentile ({ score, educationBlock, ageRange, table }) {
  if (score === null || score === undefined || score === '') return null;
  if (!educationBlock || !ageRange) return null;

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

// Looks up the percentile for a copy time. Faster time → higher percentile.
function reyResolveTimePercentile (time, age) {
  if (time === null || time === undefined || time === '') return null;

  const ageKey = reyResolveTimeAgeKey(age);
  if (!ageKey) return null;

  const column = Reflect.get(REY_TIME_TABLE, ageKey);
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

// ── Shared HTML helpers ───────────────────────────────────────────────────────

// Title bar with the close (X) button, shared by both the consult and form views.
function reyModalHeader (title) {
  return `
      <div class="modal__header">
        <h2 class="modal__title">${title}</h2>
        <button id="btnCloseREY" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>`;
}

// ── CONSULT REY VIEW ──────────────────────────────────────────────────────────
// Read-only view shown when opening a completed REY result.

// One read-only block showing score, percentile, time, and time percentile for an area.
function reyAreaSection (title, area) {
  return `
      <div class="flex flex-col gap-3 py-5 border-b border-gray-200">
        <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          ${title}
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Puntuación</span>
            <span class="text-base text-gray-900 font-medium">${area?.score ?? '—'}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Percentil</span>
            <span class="text-base text-gray-900 font-medium">${area?.pc ?? '—'}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Tiempo (min)</span>
            <span class="text-base text-gray-900 font-medium">${area?.time ?? '—'}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">Pc Tiempo</span>
            <span class="text-base text-gray-900 font-medium">${area?.pcTime ?? '—'}</span>
          </div>
        </div>
      </div>`;
}

// Full read-only modal — date, the three areas, and notes.
function buildREYConsultHTML (test) {
  const notes     = test.notes ?? '';
  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  return `
    <div class="modal">
      ${reyModalHeader('REY')}
      <div class="modal__body flex flex-col">
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Fecha:</span>
          <span class="text-base sm:text-lg text-gray-900">${dateLabel}</span>
        </div>
        ${reyAreaSection('R-C — Copia',                test.rc)}
        ${reyAreaSection('R-MCp — Memoria Corto Plazo', test.mcp)}
        ${reyAreaSection('R-MLp — Memoria Largo Plazo', test.mlp)}
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-all whitespace-pre-wrap">
            ${notes ? escapeHTML(notes) : '—'}
          </span>
        </div>
        ${buildModalConsultActions({ cancelId: 'btnCancelREY', label: 'Cerrar' })}
      </div>
    </div>`;
}

// ── FORM HTML ─────────────────────────────────────────────────────────────────
// Form used for both registering and modifying a REY result.

// Blue info banner if schooling + age are available; yellow warning otherwise.
// Percentile preview only works when both values are present.
function reyInfoBanner (schoolingData, ageData, prefill) {
  const hasAge      = ageData?.age != null;
  const hasSchooling = schoolingData?.years != null;
  if (hasAge && hasSchooling) {
    return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke-width="1.5" stroke="currentColor" class="w-5 h-5 shrink-0 text-blue-500">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12
                 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347
                 m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12
                 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814
                 m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1
                 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0
                 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981
                 0 0 0 6.75 15.75v-1.5"/>
      </svg>
      <div class="flex flex-col flex-1">
        <span class="text-sm font-medium text-blue-700">
          Escolaridad: ${escapeHTML(schoolingData.schooling)}
          (${schoolingData.years} años) —
          Bloque: ${schoolingData.years > 12 ? '>12' : '1-12'}
        </span>
        <span class="text-xs text-blue-500">
          Edad: ${ageData.age} años — Rango: ${prefill.ageRange ?? '—'}
        </span>
      </div>
      <a href="/assets/rey_interpretacion.pdf" target="_blank" rel="noopener"
         title="Ver tabla de interpretaciones" class="shrink-0 text-blue-700 hover:text-blue-900 transition-colors">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"/>
        </svg>
      </a>
    </div>`;
  }
  return `
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-50 border border-yellow-200">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke-width="1.5" stroke="currentColor" class="w-5 h-5 shrink-0 text-yellow-500">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
      </svg>
      <span class="text-sm text-yellow-700">
        Sin datos de escolaridad o edad — los percentiles no se calcularán en vivo
      </span>
    </div>`;
}

// Score input — required, must be between 0 and 100, max 5 characters.
function reyScoreField ({ scoreId, errorId, prefillArea }) {
  return `
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Puntuación <span class="text-red-500">*</span></label>
            <input
              id="${scoreId}"
              type="text"
              inputmode="decimal"
              required
              oninput="this.value=this.value.replace(/[^0-9.]/g,'').replace(/(\\..*)\\./,'$1').slice(0,5);var n=parseFloat(this.value);if(!isNaN(n)&&n>100)this.value='100';"
              placeholder="Score"
              value="${escapeHTML(String(prefillArea.score))}"
              class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition"/>
            <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
          </div>`;
}

// Time input — required, 0-100 minutes, allows one decimal place.
function reyTimeField ({ timeId, timeErrorId, prefillArea }) {
  return `
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Tiempo (min) <span class="text-red-500">*</span></label>
            <input
              id="${timeId}"
              type="text"
              inputmode="decimal"
              required
              oninput="this.value=this.value.replace(/[^0-9.]/g,'').replace(/(\\..*)\\./,'$1').slice(0,5);var n=parseFloat(this.value);if(!isNaN(n)&&n>100)this.value='100';"
              placeholder="Tiempo"
              value="${escapeHTML(String(prefillArea.time))}"
              class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition"/>
            <p id="${timeErrorId}" class="text-xs text-red-500 hidden"></p>
          </div>`;
}

// One editable area row: score input → live percentile | time input → live time percentile.
function reyAreaRow ({ title, scoreId, pcId, timeId, pcTimeId, errorId, timeErrorId, prefillArea }) {
  return `
      <div class="flex flex-col gap-2">
        <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">${title}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${reyScoreField({ scoreId, errorId, prefillArea })}
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Percentil</label>
            <div class="w-full h-[40px] flex items-center
                        border border-gray-300 rounded-lg px-3 bg-gray-50">
              <span id="${pcId}" class="text-sm text-gray-800">${prefillArea.pc ?? '—'}</span>
            </div>
          </div>
          ${reyTimeField({ timeId, timeErrorId, prefillArea })}
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Pc Tiempo</label>
            <div class="w-full h-[40px] flex items-center
                        border border-gray-300 rounded-lg px-3 bg-gray-50">
              <span id="${pcTimeId}" class="text-sm text-gray-800">${prefillArea.pcTime ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>`;
}

// Notes textarea with character counter, error message slot, and Cancel / Save buttons.
function reyFormActions (prefill) {
  return `
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Notas</label>
          <div class="relative">
            <textarea
              id="inputREYNotes"
              rows="2"
              maxlength="200"
              placeholder="Observaciones"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition resize-none pb-5"
            >${escapeHTML(prefill.notes)}</textarea>
            <p id="reyNotesCount" class="absolute bottom-2 right-2 text-xs text-gray-500">
              ${prefill.notes.length} / 200
            </p>
          </div>
        </div>
        <p id="reyApiError" class="text-xs text-red-500 hidden"></p>
        ${buildModalFormActions({ cancelId: 'btnCancelREY', saveId: 'btnSaveREY' })}`;
}

// Assembles the full register / modify form from the individual pieces above.
function buildREYFormHTML ({ mode, prefill, schoolingData, ageData }) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';
  return `
    <div class="modal">
      ${reyModalHeader(`REY — ${title}`)}
      <div class="modal__body flex flex-col gap-4">
        ${reyInfoBanner(schoolingData, ageData, prefill)}
        ${reyAreaRow({ title: 'R-C — Copia',
    scoreId: 'inputRC_Score',  pcId: 'displayRC_Pc',
    timeId: 'inputRC_Time',   pcTimeId: 'displayRC_PcTime',
    errorId: 'errorRC', timeErrorId: 'errorRC_Time', prefillArea: prefill.rc })}
        ${reyAreaRow({ title: 'R-MCp — Memoria Corto Plazo',
    scoreId: 'inputMCP_Score', pcId: 'displayMCP_Pc',
    timeId: 'inputMCP_Time',  pcTimeId: 'displayMCP_PcTime',
    errorId: 'errorMCP', timeErrorId: 'errorMCP_Time', prefillArea: prefill.mcp })}
        ${reyAreaRow({ title: 'R-MLp — Memoria Largo Plazo',
    scoreId: 'inputMLP_Score', pcId: 'displayMLP_Pc',
    timeId: 'inputMLP_Time',  pcTimeId: 'displayMLP_PcTime',
    errorId: 'errorMLP', timeErrorId: 'errorMLP_Time', prefillArea: prefill.mlp })}
        ${reyFormActions(prefill)}
      </div>
    </div>`;
}

// ── Areas config ──────────────────────────────────────────────────────────────
// IDs and API keys for the three test areas: R-C, R-MCp, R-MLp.

const REY_AREAS = [
  {
    scoreId: 'inputRC_Score',  pcId: 'displayRC_Pc',
    timeId: 'inputRC_Time',   pcTimeId: 'displayRC_PcTime',
    errorId: 'errorRC', timeErrorId: 'errorRC_Time', scoreKey: 'score_rc', timeKey: 'time_rc',
    table: REY_TABLE_RC,
  },
  {
    scoreId: 'inputMCP_Score', pcId: 'displayMCP_Pc',
    timeId: 'inputMCP_Time',  pcTimeId: 'displayMCP_PcTime',
    errorId: 'errorMCP', timeErrorId: 'errorMCP_Time', scoreKey: 'score_mcp', timeKey: 'time_mcp',
    table: REY_TABLE_MCP_MLP,
  },
  {
    scoreId: 'inputMLP_Score', pcId: 'displayMLP_Pc',
    timeId: 'inputMLP_Time',  pcTimeId: 'displayMLP_PcTime',
    errorId: 'errorMLP', timeErrorId: 'errorMLP_Time', scoreKey: 'score_mlp', timeKey: 'time_mlp',
    table: REY_TABLE_MCP_MLP,
  },
];

// ── Listeners ─────────────────────────────────────────────────────────────────

// Updates the character counter below the notes field as the user types.
function reySetupNotesCounter (notesInput, notesCount) {
  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
  });
}

// Wires live percentile preview for each area — updates as the clinician types.
function reySetupAreaListeners ({ areas, educationBlock, ageRange, age }) {
  areas.forEach(({ scoreId, pcId, timeId, pcTimeId, errorId, timeErrorId, table }) => {
    document.getElementById(scoreId).addEventListener('input', () => {
      const el    = document.getElementById(scoreId);
      document.getElementById(errorId).classList.add('hidden');
      const score = Number(el.value);
      if (el.value.trim() === '' || isNaN(score) || score < 0 || score > 100) {
        document.getElementById(pcId).textContent = '—';
        return;
      }
      const pc = reyResolveScorePercentile({ score, educationBlock, ageRange, table });
      document.getElementById(pcId).textContent = pc ?? '—';
    });

    document.getElementById(timeId).addEventListener('input', () => {
      const el   = document.getElementById(timeId);
      document.getElementById(timeErrorId).classList.add('hidden');
      const time = Number(el.value);
      if (el.value.trim() === '' || isNaN(time) || time < 0 || time > 100) {
        document.getElementById(pcTimeId).textContent = '—';
        return;
      }
      const pcTime = reyResolveTimePercentile(time, age);
      document.getElementById(pcTimeId).textContent = pcTime ?? '—';
    });
  });
}

// Validates all area fields — score and time are both required and must be 0-100.
// Fills the body object with valid values; returns false if anything is wrong.
function reyValidateAreas (areas, body) {
  let valid = true;
  areas.forEach(({ scoreId, timeId, errorId, timeErrorId, scoreKey, timeKey }) => {
    const scoreEl  = document.getElementById(scoreId);
    const timeEl   = document.getElementById(timeId);
    const scoreErr = document.getElementById(errorId);
    const timeErr  = document.getElementById(timeErrorId);
    const scoreVal = scoreEl.value.trim();
    const timeVal  = timeEl.value.trim();

    scoreErr.textContent = '';
    scoreErr.classList.add('hidden');
    timeErr.textContent = '';
    timeErr.classList.add('hidden');

    if (scoreVal === '') {
      scoreErr.textContent = 'Puntuación es requerida';
      scoreErr.classList.remove('hidden');
      valid = false;
    } else {
      const scoreN = Number(scoreVal);
      if (isNaN(scoreN) || scoreN < 0 || scoreN > 100) {
        scoreErr.textContent = 'Puntuación debe estar entre 0 y 100';
        scoreErr.classList.remove('hidden');
        valid = false;
      } else {
        Reflect.set(body, scoreKey, scoreN);
      }
    }

    if (timeVal === '') {
      timeErr.textContent = 'Tiempo es requerido';
      timeErr.classList.remove('hidden');
      valid = false;
    } else {
      const timeN = Number(timeVal);
      if (isNaN(timeN) || timeN < 0 || timeN > 100) {
        timeErr.textContent = 'Tiempo debe estar entre 0 y 100';
        timeErr.classList.remove('hidden');
        valid = false;
      } else {
        Reflect.set(body, timeKey, timeN);
      }
    }
  });
  return valid;
}

// Sends the result to the server. Shows an error message if something fails.
async function reySubmitResult ({ idUser, idApplication, body, apiError, closeModal }) {
  const config = TEST_REGISTRY[3];
  setModalSaveBusy('btnSaveREY', true);
  try {
    const res  = await fetch(config.endpoint(idUser, idApplication), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      apiError.textContent = json.error || 'Error al guardar el resultado';
      apiError.classList.remove('hidden');
      return;
    }
    updateTestCardStatus(json.data);
    closeModal();
    showToast('Resultado guardado con éxito');
  } catch (_err) {
    apiError.textContent = 'No se pudo conectar con el servidor';
    apiError.classList.remove('hidden');
    // eslint-disable-next-line no-console
    console.error('[REY] post error:', _err);
  } finally {
    setModalSaveBusy('btnSaveREY', false);
  }
}

// Validates the form then sends the data to the server.
async function reyHandleSave ({ areas, notesInput, apiError, idUser, idApplication, closeModal }) {
  apiError.classList.add('hidden');
  const body  = {};
  const valid = reyValidateAreas(areas, body);
  if (!valid) return;
  body.notes = notesInput.value.trim() || null;
  await reySubmitResult({ idUser, idApplication, body, apiError, closeModal });
}

// Wires up all interactive behavior: notes counter, live percentiles, and save button.
function bindREYFormListeners ({ idUser, idApplication, educationBlock, ageRange, age, closeModal }) {
  const notesInput = document.getElementById('inputREYNotes');
  const notesCount = document.getElementById('reyNotesCount');
  const apiError   = document.getElementById('reyApiError');

  reySetupNotesCounter(notesInput, notesCount);
  reySetupAreaListeners({ areas: REY_AREAS, educationBlock, ageRange, age });

  document.getElementById('btnSaveREY').addEventListener('click', () => {
    reyHandleSave({ areas: REY_AREAS, notesInput, apiError, idUser, idApplication, closeModal });
  });
}

// ── Open modal ────────────────────────────────────────────────────────────────

// Builds the initial form values — empty when registering, filled from the saved result when modifying.
function reyBuildPrefill (isReadable, fetchedTest, ageRange) {
  function area (a) {
    return {
      score: isReadable ? (a?.score  ?? '') : '',
      pc: isReadable ? (a?.pc     ?? '—') : '—',
      time: isReadable ? (a?.time   ?? '') : '',
      pcTime: isReadable ? (a?.pcTime ?? '—') : '—',
    };
  }
  return {
    rc: area(fetchedTest.rc),
    mcp: area(fetchedTest.mcp),
    mlp: area(fetchedTest.mlp),
    notes: isReadable ? (fetchedTest.notes ?? '') : '',
    ageRange: ageRange ?? '—',
  };
}

// Fetches schooling, age, and (if needed) the existing result in parallel before showing the modal.
async function reyFetchModalData ({ idUser, idApplication, isModify, isConsult, test }) {
  let schoolingData = null;
  let ageData       = null;
  let fetchedTest   = test;

  const fetches = [
    fetch(`/api/users/${idUser}/schooling`)
      .then(r => r.json())
      .then(json => { schoolingData = json; })
      .catch(() => { schoolingData = null; }),
    fetch(`/api/users/${idUser}/age`)
      .then(r => r.json())
      .then(json => { ageData = json; })
      .catch(() => { ageData = null; }),
  ];

  if (isModify || isConsult) {
    fetches.push(fetch(`/api/users/${idUser}/applications/${idApplication}/tests/3/results/${test.idResults}`)
      .then(r => r.json())
      .then(json => { if (json.data) fetchedTest = { ...test, ...json.data }; })
      .catch(() => { showToast('No se pudo conectar con el servidor'); }));
  }

  await Promise.all(fetches);
  return { schoolingData, ageData, fetchedTest };
}

// Entry point — fetches data, builds the right view (consult / form), and mounts the modal.
// eslint-disable-next-line no-unused-vars
async function openREYModal ({ idUser, idApplication, test, mode }) {
  const existing = document.getElementById('modalREY');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  const { schoolingData, ageData, fetchedTest } =
    await reyFetchModalData({ idUser, idApplication, isModify, isConsult, test });

  const educationBlock = reyResolveEducationBlock(schoolingData?.years ?? null);
  const ageRange       = reyResolveAgeRange(ageData?.age ?? null);
  const age            = ageData?.age ?? null;
  const prefill        = reyBuildPrefill(isModify || isConsult, fetchedTest, ageRange);

  const modal = document.createElement('div');
  modal.id        = 'modalREY';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildREYConsultHTML(fetchedTest)
    : buildREYFormHTML({ mode, prefill, schoolingData, ageData });

  document.body.appendChild(modal);

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseREY').addEventListener('click', closeModal);
  document.getElementById('btnCancelREY').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  if (!isConsult) {
    bindREYFormListeners({ idUser, idApplication, educationBlock, ageRange, age, closeModal });
  }
}
