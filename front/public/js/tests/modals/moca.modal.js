/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

// ── Interpretation ───────────────────────────────────────────────────────────

function interpretMOCA (finalScore) {
  const n = Number(finalScore);
  if (isNaN(n))  return '';
  if (n >= 26)   return 'Rendimiento cognitivo normal';
  if (n >= 18)   return 'Deterioro cognitivo leve';
  if (n >= 10)   return 'Deterioro cognitivo moderado';
  return 'Deterioro cognitivo grave';
}

// ── Final score resolution ───────────────────────────────────────────────────
// Applies +2 bonus if schooling <= 12 years and raw score <= 28.
// Mirrors server-side logic — used only for live display, never trusted.

function resolveMOCAFinalScore (raw, schoolingYears) {
  const n = Number(raw);
  if (isNaN(n)) return null;
  if (schoolingYears !== null && schoolingYears <= 12 && n <= 28) {
    return Math.min(n + 2, 30);
  }
  return Math.min(n, 30);
}

// ── Consult HTML ─────────────────────────────────────────────────────────────
// Read-only view of a graded MOCA result.
// MOCA has a single score + interpretation — no areas structure.

function buildMOCAConsultHTML (test) {
  const notes = test.notes ?? '';

  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—';

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">MoCA</h2>
        <button id="btnCloseMOCA" class="modal__close" aria-label="Cerrar modal">
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

        <!-- Puntaje final -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Puntaje:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${test.score ?? '—'}
          </span>
        </div>

        <!-- Interpretación -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Interpretación:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${escapeHTML(test.interpretation ?? '—')}
          </span>
        </div>

        <!-- Notas -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-words">
            ${notes ? escapeHTML(notes) : '—'}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelMOCA"
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