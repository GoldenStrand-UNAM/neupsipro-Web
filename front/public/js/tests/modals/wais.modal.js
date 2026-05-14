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

// ── register / modify form modal


function buildWAISFormHTML (mode, prefill) {
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
        <h2 class="modal__title">WAIS — ${title}</h2>
        <button id="btnCloseWAIS" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-6">

        ${areaRow('Comprensión Verbal',         'inputComVerbal',      'interpComVerbal',      'errorComVerbal',      prefill.comVerbal)}
        ${areaRow('Razonamiento Perceptual',     'inputRazonPerceptual','interpRazonPerceptual','errorRazonPerceptual', prefill.razonPerceptual)}
        ${areaRow('Memoria de Trabajo',          'inputMemWork',        'interpMemWork',        'errorMemWork',        prefill.memWork)}
        ${areaRow('Velocidad de Procesamiento',  'inputVeloProce',      'interpVeloProce',      'errorVeloProce',      prefill.veloProce)}

        <!-- CI Total — manually entered by clinician, no interpretation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div class="flex flex-col gap-1">
            <label class="text-2xl font-regular">
              CI Total <span class="text-red-500">*</span>
            </label>
            <input
              id="inputWAISTotal"
              type="number"
              min="0"
              placeholder="Valor"
              value="${escapeHTML(String(prefill.scoreTotal))}"
              class="w-full h-[52px] border border-gray-300 rounded-lg px-4 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition"/>
            <p id="errorWAISTotal" class="text-xs text-red-500 hidden"></p>
          </div>

          <!-- Empty col to keep grid alignment -->
          <div></div>

        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea
            id="inputWAISNotes"
            rows="4"
            maxlength="200"
            placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          >${escapeHTML(prefill.notes)}</textarea>
          <p id="waisNotesCount" class="text-lg text-gray-400 text-right">
            ${prefill.notes.length} / 200
          </p>
        </div>

        <p id="waisApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">

          <button id="btnCancelWAIS"
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

          <button id="btnSaveWAIS"
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

// Live interpretation

function bindWAISFormListeners (idUser, idApplication, closeModal) {

  const notesInput = document.getElementById('inputWAISNotes');
  const notesCount = document.getElementById('waisNotesCount');
  const apiError   = document.getElementById('waisApiError');

  // Area fields — each has live interpretation
  const fields = [
    { input: 'inputComVerbal',       interp: 'interpComVerbal',       error: 'errorComVerbal',       key: 'score_com_verbal'       },
    { input: 'inputRazonPerceptual', interp: 'interpRazonPerceptual', error: 'errorRazonPerceptual', key: 'score_razon_perceptual' },
    { input: 'inputMemWork',         interp: 'interpMemWork',         error: 'errorMemWork',         key: 'score_mem_work'         },
    { input: 'inputVeloProce',       interp: 'interpVeloProce',       error: 'errorVeloProce',       key: 'score_velo_proce'       },
  ];

  // ── Notes counter ──────────────────────────────────────────────────────────

  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });

  // ── Live interpretation per area ───────────────────────────────────────────

  fields.forEach(({ input, interp, error }) => {
    document.getElementById(input).addEventListener('input', () => {
      const el    = document.getElementById(input);
      const errEl = document.getElementById(error);

      // Strip non-digit characters
      if (!/^\d*$/.test(el.value)) el.value = el.value.replace(/\D/g, '');

      errEl.classList.add('hidden');

      const n = Number(el.value);
      document.getElementById(interp).textContent =
        el.value === '' || isNaN(n) ? '—' : interpretWAIS(n);
    });
  });

  // ── Save ───────────────────────────────────────────────────────────────────

  document.getElementById('btnSaveWAIS').addEventListener('click', async () => {
    apiError.classList.add('hidden');

    let valid  = true;
    const scores = {};

    // Validate 4 area fields
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

    // Validate CI Total — clinician-provided, no interpretation
    const totalEl    = document.getElementById('inputWAISTotal');
    const totalErrEl = document.getElementById('errorWAISTotal');
    const totalVal   = Number(totalEl.value);

    if (totalEl.value.trim() === '' || isNaN(totalVal) || totalVal < 0) {
      totalErrEl.textContent = 'Ingresa un valor válido para CI Total';
      totalErrEl.classList.remove('hidden');
      valid = false;
    } else {
      scores.score_total = totalVal;
    }

    if (!valid) return;

    const notes  = notesInput.value.trim() || null;
    const config = TEST_REGISTRY[2];

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
      console.error('[WAIS] post error:', _err);
    }
  });

}

// Fetches existing result before opening modify/consult.

// eslint-disable-next-line no-unused-vars
async function openWAISModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalWAIS');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  // ── Fetch existing result before opening modify/consult ──────────────────

  let fetchedTest = test;

  if (isModify || isConsult) {
    try {
      const res = await fetch(
        `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas/2/resultados/${test.idResults}`
      );
      const json = await res.json();

      if (!res.ok) {
        showToast(json.error || 'No se pudieron cargar los resultados');
        return;
      }

      // Merge fetched data into test object — keeps idTest, testName, etc.
      fetchedTest = { ...test, ...json.data };

    } catch (_err) {
      showToast('No se pudo conectar con el servidor');
      // eslint-disable-next-line no-console
      console.error('[WAIS] get error:', _err);
      return;
    }
  }

  // ── Build prefill from fetched data ──────────────────────────────────────

  const areas = (isModify || isConsult) ? (fetchedTest.areas ?? {}) : {};
  const prefill = {
    comVerbal: {
      score:  areas.comVerbal?.score          ?? '',
      interp: areas.comVerbal?.interpretation ?? '—',
    },
    razonPerceptual: {
      score:  areas.razonPerceptual?.score          ?? '',
      interp: areas.razonPerceptual?.interpretation ?? '—',
    },
    memWork: {
      score:  areas.memWork?.score          ?? '',
      interp: areas.memWork?.interpretation ?? '—',
    },
    veloProce: {
      score:  areas.veloProce?.score          ?? '',
      interp: areas.veloProce?.interpretation ?? '—',
    },
    scoreTotal: (isModify || isConsult) ? (fetchedTest.scoreTotal ?? '') : '',
    notes:      (isModify || isConsult) ? (fetchedTest.notes      ?? '') : '',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const modal = document.createElement('div');
  modal.id        = 'modalWAIS';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildWAISConsultHTML(fetchedTest)
    : buildWAISFormHTML(mode, prefill);

  document.body.appendChild(modal);

  // ── Shared close logic ────────────────────────────────────────────────────

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseWAIS').addEventListener('click', closeModal);
  document.getElementById('btnCancelWAIS').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ── Form listeners only on register / modify ──────────────────────────────

  if (!isConsult) {
    bindWAISFormListeners(idUser, idApplication, closeModal);
  }
}