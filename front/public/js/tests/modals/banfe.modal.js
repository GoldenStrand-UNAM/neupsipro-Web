/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

// ── Interpretation ───────────────────────────────────────────────────────────

function interpretBANFE (score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n <= 69)   return 'Alteración severa';
  if (n <= 84)   return 'Alteración leve-moderada';
  if (n <= 115)  return 'Normal';
  return 'Normal alto';
}

// ── Consult HTML ─────────────────────────────────────────────────────────────
// Read-only view of a graded BANFE result.

function buildConsultHTML (test) {
  const areas   = test.areas ?? {};
  const notes   = test.notes ?? '';

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
        <h2 class="modal__title">BANFE</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
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

        ${areaRow('Orbito Frontal',      areas.orbitFrontal)}
        ${areaRow('Prefrontal Anterior', areas.prefrontalBefore)}
        ${areaRow('Dorsolateral',        areas.dLateral)}

        <!-- Score Total -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Score Total:</span>
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
          <button id="btnCancelBANFE"
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

// ── REGISTER / MODIFY
// Shared view BANFE for register and modify modes.

function buildFormHTML (mode, prefill) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';

  // Reusable area row — score input + live interpretation display
  function areaRow (label, inputId, interpId, errorId, prefillArea) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div class="flex flex-col gap-1">
          <label class="text-2xl font-regular">
            ${label} <span class="text-red-500">*</span>
          </label>
          <input
            id="${inputId}"
            type="number"
            min="0"
            placeholder="Puntaje"
            value="${escapeHTML(String(prefillArea.score))}"
            class="w-full h-[52px] border border-gray-300 rounded-lg px-4 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition"/>
          <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-2xl font-regular">Interpretación</label>
          <div class="w-full h-[52px] flex items-center
                      border border-gray-300 rounded-lg px-4 bg-gray-50">
            <span id="${interpId}" class="text-sm text-gray-800">
              ${escapeHTML(prefillArea.interp)}
            </span>
          </div>
        </div>

      </div>`;
  }

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">BANFE — ${title}</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-6">

        ${areaRow('Orbito Frontal',      'inputOrbitFrontal',     'interpOrbitFrontal',     'errorOrbitFrontal',     prefill.orbitFrontal)}
        ${areaRow('Prefrontal Anterior', 'inputPrefrontalBefore', 'interpPrefrontalBefore', 'errorPrefrontalBefore', prefill.prefrontalBefore)}
        ${areaRow('Dorsolateral',        'inputDLateral',         'interpDLateral',         'errorDLateral',         prefill.dLateral)}

        <!-- Score Total — read-only, computed live -->
        <div class="flex flex-col gap-1">
          <label class="text-2xl font-regular">Puntaje Total</label>
          <div class="w-full h-[52px] flex items-center
                      border border-gray-300 rounded-lg px-4 bg-gray-50">
            <span id="banfeScoreTotal" class="text-sm text-gray-800">—</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea
            id="inputBANFENotes"
            rows="4"
            maxlength="200"
            placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          >${escapeHTML(prefill.notes)}</textarea>
          <p id="banfeNotesCount" class="text-lg text-gray-400 text-right">
            ${prefill.notes.length} / 200
          </p>
        </div>

        <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">

          <button id="btnCancelBANFE"
            class="flex-1 flex items-center justify-center gap-3
                   px-4 py-3 border border-gray-300 rounded-2xl
                   font-regular hover:bg-gray-50 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <span class="whitespace-nowrap">Cancelar</span>
          </button>

          <button id="btnSaveBANFE"
            class="flex-1 flex items-center justify-center gap-3
                   px-4 py-3 rounded-2xl bg-[#3350A9] text-white
                   font-regular hover:bg-[#2a4190] transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-8H7v8"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 3v5h8"/>
            </svg>
            <span class="whitespace-nowrap">Guardar</span>
          </button>

        </div>
      </div>
    </div>`;
}

// ── Form Listeners ───────────────────────────────────────────────────────────
// Wires up live interpretation, running total, notes counter,
// validation, and the save fetch for register/modify modes.

function bindFormListeners (idUser, idApplication, closeModal) {

  const notesInput = document.getElementById('inputBANFENotes');
  const notesCount = document.getElementById('banfeNotesCount');
  const apiError   = document.getElementById('banfeApiError');

  // Area fields — order matters for total calculation
  const fields = [
    { input: 'inputOrbitFrontal',     interp: 'interpOrbitFrontal',     error: 'errorOrbitFrontal',     key: 'score_orbit_frontal'     },
    { input: 'inputPrefrontalBefore', interp: 'interpPrefrontalBefore', error: 'errorPrefrontalBefore', key: 'score_prefrontal_before' },
    { input: 'inputDLateral',         interp: 'interpDLateral',         error: 'errorDLateral',         key: 'score_d_lateral'         },
  ];

  // ── Notes counter ──────────────────────────────────────────────────────────

  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });

  // ── Live total ─────────────────────────────────────────────────────────────
  // Recalculates score total whenever any area input changes.
  // Shows '—' until all three fields have a value.

  function updateTotal () {
    const values = fields.map(({ input }) => document.getElementById(input).value.trim());
    const allFilled = values.every(v => v !== '');
    document.getElementById('banfeScoreTotal').textContent = allFilled
      ? values.reduce((acc, v) => acc + Number(v), 0)
      : '—';
  }

  // ── Live interpretation per area ───────────────────────────────────────────

  fields.forEach(({ input, interp, error }) => {
    document.getElementById(input).addEventListener('input', () => {
      const el     = document.getElementById(input);
      const errEl  = document.getElementById(error);

      // Strip non-digit characters
      if (!/^\d*$/.test(el.value)) el.value = el.value.replace(/\D/g, '');

      errEl.classList.add('hidden');

      const n = Number(el.value);
      document.getElementById(interp).textContent =
        el.value === '' || isNaN(n) ? '—' : interpretBANFE(n);

      updateTotal();
    });
  });

  // ── Save ───────────────────────────────────────────────────────────────────

  document.getElementById('btnSaveBANFE').addEventListener('click', async () => {
    apiError.classList.add('hidden');

    // Validate all three area scores
    let valid  = true;
    const scores = {};

    fields.forEach(({ input, error, key }) => {
      const el    = document.getElementById(input);
      const errEl = document.getElementById(error);
      const val   = Number(el.value);

      if (el.value.trim() === '' || isNaN(val) || val < 0) {
        errEl.textContent = 'Ingresa un puntaje válido';
        errEl.classList.remove('hidden');
        valid = false;
      } else {
        scores[key] = val;
      }
    });

    if (!valid) return;

    const notes  = notesInput.value.trim() || null;
    const config = TEST_REGISTRY[1];

    try {
      const res = await fetch(config.endpoint(idUser, idApplication), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ...scores, notes }),
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
      console.error('[BANFE] post error:', _err);
    }
  });
}