/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */

// ── Interpretation ────────────────────────────────────────────────────────────

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

// ── Consult helpers ───────────────────────────────────────────────────────────

// Score + interpretation row used in consult view
function consultAreaRow (label, area) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
      <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">${label}:</span>
      <div class="flex flex-col gap-1">
        <span class="text-base sm:text-lg text-gray-900 font-medium">${area?.score ?? '—'}</span>
        <span class="text-sm text-gray-500">${escapeHTML(area?.interpretation ?? '—')}</span>
      </div>
    </div>`;
}

// Generic label + arbitrary content row
function consultDataRow (label, content) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
      <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">${label}:</span>
      ${content}
    </div>`;
}

// Modal body for consult mode
function buildConsultBody (test, dateLabel) {
  const areas = test.areas ?? {};
  const notes = test.notes ?? '';
  return `
    <div class="modal__body flex flex-col">
      ${consultDataRow('Fecha', `<span class="text-base sm:text-lg text-gray-900">${dateLabel}</span>`)}
      ${consultAreaRow('Comprensión Verbal',         areas.comVerbal)}
      ${consultAreaRow('Razonamiento Perceptual',    areas.razonPerceptual)}
      ${consultAreaRow('Memoria de Trabajo',         areas.memWork)}
      ${consultAreaRow('Velocidad de Procesamiento', areas.veloProce)}
      ${consultAreaRow('CI Total', { score: test.scoreTotal, interpretation: test.interTotal })}
      ${consultDataRow('Notas', `<span class="text-base sm:text-lg text-gray-900 leading-relaxed break-words">${notes ? escapeHTML(notes) : '—'}</span>`)}
      <div class="flex justify-end pt-4 border-t border-gray-200">
        <button id="btnCancelWAIS"
          class="flex items-center gap-3 px-6 py-3 border border-gray-300 rounded-2xl
                 text-base hover:bg-gray-50 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          Cerrar
        </button>
      </div>
    </div>`;
}

function buildWAISConsultHTML (test) {
  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
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
      ${buildConsultBody(test, dateLabel)}
    </div>`;
}

// ── Form helpers ──────────────────────────────────────────────────────────────

// Input + live-interpretation row used in register/modify form
function formAreaRow ({ label, inputId, interpId, errorId, prefillArea }) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">
          ${label} <span class="text-red-500">*</span>
        </label>
        <input id="${inputId}" type="number" min="0" max="300" placeholder="Puntaje"
          value="${escapeHTML(String(prefillArea.score))}"
          class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                 focus:border-transparent transition"/>
        <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium text-gray-700">Interpretación</label>
        <div class="w-full h-[40px] flex items-center border border-gray-300 rounded-lg px-3 bg-gray-50">
          <span id="${interpId}" class="text-sm text-gray-800">${escapeHTML(prefillArea.interp)}</span>
        </div>
      </div>
    </div>`;
}

// Cancel + save buttons shared by register and modify
function buildFormActions () {
  return `
    <div class="flex justify-end gap-3">
      <button id="btnCancelWAIS"
        class="flex-1 flex items-center justify-center gap-3 px-4 py-3
               border border-gray-300 rounded-2xl font-regular
               hover:bg-gray-50 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <span class="whitespace-nowrap">Cancelar</span>
      </button>
      <button id="btnSaveWAIS"
        class="flex-1 flex items-center justify-center gap-3 px-4 py-3
               rounded-2xl bg-[#3350A9] text-white font-regular
               hover:bg-[#2a4190] transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-8H7v8"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 3v5h8"/>
        </svg>
        <span class="whitespace-nowrap">Guardar</span>
      </button>
    </div>`;
}

function buildWAISFormHTML (mode, prefill) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';
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
      <div class="modal__body flex flex-col gap-3">
        ${formAreaRow({ label: 'Comprensión Verbal',         inputId: 'inputComVerbal',       interpId: 'interpComVerbal',       errorId: 'errorComVerbal',       prefillArea: prefill.comVerbal })}
        ${formAreaRow({ label: 'Razonamiento Perceptual',    inputId: 'inputRazonPerceptual', interpId: 'interpRazonPerceptual', errorId: 'errorRazonPerceptual', prefillArea: prefill.razonPerceptual })}
        ${formAreaRow({ label: 'Memoria de Trabajo',         inputId: 'inputMemWork',         interpId: 'interpMemWork',         errorId: 'errorMemWork',         prefillArea: prefill.memWork })}
        ${formAreaRow({ label: 'Velocidad de Procesamiento', inputId: 'inputVeloProce',       interpId: 'interpVeloProce',       errorId: 'errorVeloProce',       prefillArea: prefill.veloProce })}
        ${formAreaRow({ label: 'CI Total',                   inputId: 'inputWAISTotal',       interpId: 'interpWAISTotal',       errorId: 'errorWAISTotal',       prefillArea: prefill.ciTotal })}
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Notas</label>
          <textarea id="inputWAISNotes" rows="2" maxlength="200" placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          >${escapeHTML(prefill.notes)}</textarea>
          <p id="waisNotesCount" class="text-xs text-gray-400 text-right">${prefill.notes.length} / 200</p>
        </div>
        <p id="waisApiError" class="text-xs text-red-500 hidden"></p>
        ${buildFormActions()}
      </div>
    </div>`;
}

// ── Field definitions ─────────────────────────────────────────────────────────

// All five scored inputs — used for live updates and save validation
const WAIS_FIELDS = [
  { input: 'inputComVerbal',       interp: 'interpComVerbal',       error: 'errorComVerbal',       key: 'score_com_verbal'       },
  { input: 'inputRazonPerceptual', interp: 'interpRazonPerceptual', error: 'errorRazonPerceptual', key: 'score_razon_perceptual' },
  { input: 'inputMemWork',         interp: 'interpMemWork',         error: 'errorMemWork',         key: 'score_mem_work'         },
  { input: 'inputVeloProce',       interp: 'interpVeloProce',       error: 'errorVeloProce',       key: 'score_velo_proce'       },
  { input: 'inputWAISTotal',       interp: 'interpWAISTotal',       error: 'errorWAISTotal',       key: 'score_total'            },
];

// ── Listeners ─────────────────────────────────────────────────────────────────

// Digits-only, max 5 chars, live interpretation per field
function bindAreaUpdates (fields) {
  fields.forEach(({ input, interp, error }) => {
    document.getElementById(input).addEventListener('input', () => {
      const el    = document.getElementById(input);
      const errEl = document.getElementById(error);
      if (!/^\d*$/.test(el.value)) el.value = el.value.replace(/\D/g, '');
      if (el.value.length > 5) el.value = el.value.slice(0, 5);
      errEl.classList.add('hidden');
      const n = Number(el.value);
      document.getElementById(interp).textContent = el.value === '' || isNaN(n) ? '—' : interpretWAIS(n);
    });
  });
}

// Validates all fields, posts to API, updates card on success
async function handleSave (endpoint, fields, ctx) {
  const { notesInput, apiError, closeModal } = ctx;
  apiError.classList.add('hidden');
  let valid = true;
  const scores = new Map();
  fields.forEach(({ input, error, key }) => {
    const el    = document.getElementById(input);
    const errEl = document.getElementById(error);
    const val   = Number(el.value);
    if (el.value.trim() === '' || isNaN(val) || val < 0 || val > 300) {
      errEl.textContent = 'Ingresa un puntaje válido (0–300)';
      errEl.classList.remove('hidden');
      valid = false;
    } else {
      scores.set(key, val);
    }
  });
  if (!valid) return;
  const notes = notesInput.value.trim() || null;
  try {
    const res  = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
      body: JSON.stringify({ ...Object.fromEntries(scores), notes }),
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
}

function bindWAISFormListeners (idUser, idApplication, closeModal) {
  const notesInput = document.getElementById('inputWAISNotes');
  const notesCount = document.getElementById('waisNotesCount');
  const apiError   = document.getElementById('waisApiError');
  const endpoint   = TEST_REGISTRY[2].endpoint(idUser, idApplication);
  // Notes character counter
  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });
  bindAreaUpdates(WAIS_FIELDS);
  document.getElementById('btnSaveWAIS').addEventListener(
    'click',
    () => handleSave(endpoint, WAIS_FIELDS, { notesInput, apiError, closeModal })
  );
}

// ── Open modal ────────────────────────────────────────────────────────────────

// Fetches an existing WAIS result; returns null and shows toast on failure
async function fetchWaisResult (idUser, idApplication, idResults) {
  try {
    const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests/2/results/${idResults}`);
    const json = await res.json();
    if (!res.ok) {
      showToast(json.error || 'No se pudieron cargar los resultados');
      return null;
    }
    return json.data;
  } catch (_err) {
    showToast('No se pudo conectar con el servidor');
    // eslint-disable-next-line no-console
    console.error('[WAIS] get error:', _err);
    return null;
  }
}

// Builds the prefill object for register (empty) or modify/consult (from fetched data)
function buildPrefill (fetchedTest, needsData) {
  const areas = needsData ? (fetchedTest.areas ?? {}) : {};
  const notes = needsData ? (fetchedTest.notes  ?? '') : '';
  const entry = (area) => ({ score: area?.score ?? '', interp: area?.interpretation ?? '—' });
  return {
    comVerbal:       entry(areas.comVerbal),
    razonPerceptual: entry(areas.razonPerceptual),
    memWork:         entry(areas.memWork),
    veloProce:       entry(areas.veloProce),
    ciTotal: {
      score: needsData ? (fetchedTest.scoreTotal ?? '') : '',
      interp: needsData ? (fetchedTest.interTotal ?? '—') : '—',
    },
    notes,
  };
}

// eslint-disable-next-line no-unused-vars
async function openWAISModal (idUser, idApplication, { test, mode }) {
  const existing = document.getElementById('modalWAIS');
  if (existing) existing.remove();
  const isConsult = mode === 'consult';
  const needsData = mode === 'modify' || isConsult;
  let fetchedTest = test;
  if (needsData) {
    const data = await fetchWaisResult(idUser, idApplication, test.idResults);
    if (!data) return;
    fetchedTest = { ...test, ...data };
  }
  const modal = document.createElement('div');
  modal.id        = 'modalWAIS';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildWAISConsultHTML(fetchedTest)
    : buildWAISFormHTML(mode, buildPrefill(fetchedTest, needsData));
  document.body.appendChild(modal);
  function closeModal () { modal.remove(); }
  document.getElementById('btnCloseWAIS').addEventListener('click', closeModal);
  document.getElementById('btnCancelWAIS').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  if (!isConsult) bindWAISFormListeners(idUser, idApplication, closeModal);
}
