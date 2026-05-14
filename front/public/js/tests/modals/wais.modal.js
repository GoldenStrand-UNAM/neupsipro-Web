/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

// Interpretation 

function interpretWAIS (score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n >= 130)  return 'Alta capacidad intelectual';
  if (n >= 120)  return 'Superior';
  if (n >= 110)  return 'Promedio alto';
  if (n >= 90)   return 'Promedio';
  if (n >= 80)   return 'Promedio bajo';
  if (n >= 70)   return 'Limítrofe';
  return 'Discapacidad';
}

// Render WAIS consult modal with test data

function buildWAISConsultHTML (test) {
  const areas = test.areas ?? {};
  const notes = test.notes ?? '';

  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—';

  // Reusable row for each area — score on top, interpretation below
  function areaRow (label, area) {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                  gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
        <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">${label}:</span>
        <div class="flex flex-col gap-1">
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${area?.score ?? '—'}
          </span>
          <span class="text-sm text-gray-500">
            ${escapeHTML(area?.interpretation ?? '—')}
          </span>
        </div>
      </div>`;
  }

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">WAIS</h2>
        <button id="btnCloseWAIS" class="modal__close" aria-label="Cerrar modal">
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

        ${areaRow('Comprensión Verbal',        areas.comVerbal)}
        ${areaRow('Razonamiento Perceptual',   areas.razonPerceptual)}
        ${areaRow('Memoria de Trabajo',        areas.memWork)}
        ${areaRow('Velocidad de Procesamiento', areas.veloProce)}

        <!-- CI Total — no interpretation, clinician-provided -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">CI Total:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${test.scoreTotal ?? '—'}
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
          <button id="btnCancelWAIS"
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