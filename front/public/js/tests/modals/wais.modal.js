/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */
/* global buildModalFormActions, buildModalConsultActions, setModalSaveBusy */

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
      ${buildModalConsultActions({ cancelId: 'btnCancelWAIS', label: 'Cerrar' })}
    </div>`;
}

function buildWAISConsultHTML (test) {
  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
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

// ── Tab switching ─────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
function switchWAISTab (tab) {
  const formContent   = document.getElementById('waisTabForm');
  const interpContent = document.getElementById('waisTabInterp');
  const tabForm       = document.getElementById('waisTabBtnForm');
  const tabInterp     = document.getElementById('waisTabBtnInterp');
  const actions       = document.getElementById('waisActions');
  if (tab === 'form') {
    formContent.classList.remove('hidden');
    interpContent.classList.add('hidden');
    actions.classList.remove('hidden');
    tabForm.classList.add('text-[#3350A9]', 'border-[#3350A9]');
    tabForm.classList.remove('text-gray-400', 'border-transparent');
    tabInterp.classList.add('text-gray-400', 'border-transparent');
    tabInterp.classList.remove('text-[#3350A9]', 'border-[#3350A9]');
  } else {
    interpContent.classList.remove('hidden');
    formContent.classList.add('hidden');
    actions.classList.add('hidden');
    tabInterp.classList.add('text-[#3350A9]', 'border-[#3350A9]');
    tabInterp.classList.remove('text-gray-400', 'border-transparent');
    tabForm.classList.add('text-gray-400', 'border-transparent');
    tabForm.classList.remove('text-[#3350A9]', 'border-[#3350A9]');
  }
}

// ── Form helpers ──────────────────────────────────────────────────────────────

// Input + live-interpretation row used in register/modify form
function formAreaRow ({ label, inputId, interpId, errorId, prefillArea }) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">
          ${label} <span class="text-red-500">*</span>
        </label>
        <input id="${inputId}" type="text" inputmode="numeric" placeholder="Puntaje"
          value="${escapeHTML(String(prefillArea.score))}"
          class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                 focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                 focus:border-transparent transition"/>
        <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
      </div>
      <div class="flex flex-col gap-2">
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
    ${buildModalFormActions({ cancelId: 'btnCancelWAIS', saveId: 'btnSaveWAIS' })}`;
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
      <div class="flex border-b border-gray-200">
        <button id="waisTabBtnForm"
          onclick="switchWAISTab('form')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-[#3350A9] border-b-2 border-[#3350A9] cursor-pointer transition-colors">
          Prueba
        </button>
        <button id="waisTabBtnInterp"
          onclick="switchWAISTab('interp')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-gray-400 border-b-2 border-transparent cursor-pointer hover:text-gray-600 transition-colors">
          Interpretación
        </button>
      </div>
      <div class="modal__body flex flex-col gap-3">
        <div id="waisTabForm">
          ${formAreaRow({ label: 'Comprensión Verbal',         inputId: 'inputComVerbal',       interpId: 'interpComVerbal',       errorId: 'errorComVerbal',       prefillArea: prefill.comVerbal })}
          ${formAreaRow({ label: 'Razonamiento Perceptual',    inputId: 'inputRazonPerceptual', interpId: 'interpRazonPerceptual', errorId: 'errorRazonPerceptual', prefillArea: prefill.razonPerceptual })}
          ${formAreaRow({ label: 'Memoria de Trabajo',         inputId: 'inputMemWork',         interpId: 'interpMemWork',         errorId: 'errorMemWork',         prefillArea: prefill.memWork })}
          ${formAreaRow({ label: 'Velocidad de Procesamiento', inputId: 'inputVeloProce',       interpId: 'interpVeloProce',       errorId: 'errorVeloProce',       prefillArea: prefill.veloProce })}
          ${formAreaRow({ label: 'CI Total',                   inputId: 'inputWAISTotal',       interpId: 'interpWAISTotal',       errorId: 'errorWAISTotal',       prefillArea: prefill.ciTotal })}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="inputWAISNotes">
              Notas
            </label>
            <div class="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#3350A9] focus-within:border-[#3350A9] bg-white overflow-hidden">
              <textarea 
                id="inputWAISNotes" 
                rows="2" 
                maxlength="200" 
                placeholder="Observaciones"
                class="w-full pl-4 pt-3 pr-4 text-sm bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 resize-none block"
              >${escapeHTML(prefill.notes)}</textarea>
              <div class="bg-white pb-2 pr-3 pt-1 flex justify-end select-none pointer-events-none">
                <span id="waisNotesCount" class="text-xs text-gray-400">${prefill.notes.length}/200</span>
              </div>
            </div>
          </div>
          <p id="waisApiError" class="text-xs text-red-500 hidden"></p>
        </div>
        <div id="waisTabInterp" class="hidden flex flex-col gap-4">
          <div class="border border-gray-200 rounded-2xl overflow-hidden">
            <div class="grid grid-cols-[120px_1fr] bg-[#3350A9]">
              <span class="px-4 py-2 text-sm font-medium text-white">Puntaje</span>
              <span class="px-4 py-2 text-sm font-medium text-white">Interpretación</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≥ 130</span>
              <span class="px-4 py-3 text-sm text-gray-900">Alta capacidad intelectual</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">120 – 129</span>
              <span class="px-4 py-3 text-sm text-gray-900">Superior</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">110 – 119</span>
              <span class="px-4 py-3 text-sm text-gray-900">Promedio alto</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">90 – 109</span>
              <span class="px-4 py-3 text-sm text-gray-900">Promedio</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">80 – 89</span>
              <span class="px-4 py-3 text-sm text-gray-900">Promedio bajo</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">70 – 79</span>
              <span class="px-4 py-3 text-sm text-gray-900">Limítrofe</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≤ 69</span>
              <span class="px-4 py-3 text-sm text-gray-900">Discapacidad</span>
            </div>
          </div>
          <p class="text-xs text-gray-500">
            La interpretación aplica a todas las áreas y al CI Total por igual. Se calcula automáticamente al ingresar el puntaje.
          </p>
        </div>
        <div id="waisActions">
          ${buildFormActions()}
        </div>
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
      el.value = el.value.replace(/\D/g, '').slice(0, 3);
      const capped = parseInt(el.value, 10);
      if (!isNaN(capped) && capped > 300) el.value = '300';
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
    if (el.value.trim() === '') {
      errEl.textContent = 'Llena todos los campos';
      errEl.classList.remove('hidden');
      valid = false;
    } else if (isNaN(val) || val < 0 || val > 300) {
      errEl.textContent = val > 300 ? 'El puntaje no puede superar 300' : 'Ingresa un puntaje válido';
      errEl.classList.remove('hidden');
      valid = false;
    } else {
      scores.set(key, val);
    }
  });
  if (!valid) return;
  const notes = notesInput.value.trim() || null;
  setModalSaveBusy('btnSaveWAIS', true);
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
  } finally {
    setModalSaveBusy('btnSaveWAIS', false);
  }
}

function bindWAISFormListeners (idUser, idApplication, closeModal) {
  const notesInput = document.getElementById('inputWAISNotes');
  const notesCount = document.getElementById('waisNotesCount');
  const apiError   = document.getElementById('waisApiError');
  const endpoint   = TEST_REGISTRY[2].endpoint(idUser, idApplication);
  // Notes character counter
  notesInput.addEventListener('input', () => {
    notesInput.value = notesInput.value.replace(/\p{Extended_Pictographic}/gu, '');
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
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
    comVerbal: entry(areas.comVerbal),
    razonPerceptual: entry(areas.razonPerceptual),
    memWork: entry(areas.memWork),
    veloProce: entry(areas.veloProce),
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
