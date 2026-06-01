/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */
/* global buildModalFormActions, buildModalConsultActions, setModalSaveBusy */

function interpretBANFE (score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n <= 69)   return 'Alteración severa';
  if (n <= 84)   return 'Alteración leve-moderada';
  if (n <= 115)  return 'Normal';
  return 'Normal alto';
}

function banfeConsultAreaRow (label, area) {
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

function banfeConsultDataRow (label, content) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
      <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">${label}:</span>
      ${content}
    </div>`;
}

function buildBANFEConsultBody (test, dateLabel) {
  const areas = test.areas ?? {};
  const notes = test.notes ?? '';
  return `
    <div class="modal__body flex flex-col">
      ${banfeConsultDataRow('Fecha', `<span class="text-base sm:text-lg text-gray-900">${dateLabel}</span>`)}
      ${banfeConsultAreaRow('Orbito Frontal', areas.orbitFrontal)}
      ${banfeConsultAreaRow('Prefrontal Anterior', areas.prefrontalBefore)}
      ${banfeConsultAreaRow('Dorsolateral', areas.dLateral)}
      ${banfeConsultAreaRow('Puntaje Total', { score: test.scoreTotal, interpretation: test.interTotal })}
      ${banfeConsultDataRow('Notas', `<div class="min-w-0 overflow-hidden"><span class="text-base sm:text-lg text-gray-900 leading-relaxed break-all block">${notes ? escapeHTML(notes) : '—'}</span></div>`)}      ${buildModalConsultActions({ cancelId: 'btnCancelBANFE', label: 'Cerrar' })}
    </div>`;
}

function buildConsultHTML (test) {
  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">BANFE</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      ${buildBANFEConsultBody(test, dateLabel)}
    </div>`;
}

// eslint-disable-next-line no-unused-vars
function switchBANFETab (tab) {
  const formContent   = document.getElementById('banfeTabForm');
  const interpContent = document.getElementById('banfeTabInterp');
  const tabForm       = document.getElementById('banfeTabBtnForm');
  const tabInterp     = document.getElementById('banfeTabBtnInterp');
  const actions       = document.getElementById('banfeActions');
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

function banfeFormAreaRow ({ label, inputId, interpId, errorId, prefillArea }) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">${label} <span class="text-red-500">*</span></label>
        <input id="${inputId}" type="text" inputmode="numeric" placeholder="Puntaje"
          value="${escapeHTML(String(prefillArea.score))}"
          class="w-full h-[40px] border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3350A9] focus:border-transparent transition"/>
        <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">Interpretación</label>
        <div class="w-full h-[40px] flex items-center border border-gray-300 rounded-lg px-4 bg-gray-50">
          <span id="${interpId}" class="text-sm text-gray-800">${escapeHTML(prefillArea.interp)}</span>
        </div>
      </div>
    </div>`;
}

function buildBANFEFormActions () {
  return `
    ${buildModalFormActions({ cancelId: 'btnCancelBANFE', saveId: 'btnSaveBANFE' })}`;
}

function buildFormHTML (mode, prefill) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';
  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">BANFE — ${title}</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="flex border-b border-gray-200">
        <button id="banfeTabBtnForm"
          onclick="switchBANFETab('form')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-[#3350A9] border-b-2 border-[#3350A9] cursor-pointer transition-colors">
          Prueba
        </button>
        <button id="banfeTabBtnInterp"
          onclick="switchBANFETab('interp')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-gray-400 border-b-2 border-transparent cursor-pointer hover:text-gray-600 transition-colors">
          Interpretación
        </button>
      </div>
      <div class="modal__body flex flex-col gap-6">
        <div id="banfeTabForm">
          ${banfeFormAreaRow({ label: 'Orbito Frontal',      inputId: 'inputOrbitFrontal',     interpId: 'interpOrbitFrontal',     errorId: 'errorOrbitFrontal',     prefillArea: prefill.orbitFrontal })}
          ${banfeFormAreaRow({ label: 'Prefrontal Anterior', inputId: 'inputPrefrontalBefore', interpId: 'interpPrefrontalBefore', errorId: 'errorPrefrontalBefore', prefillArea: prefill.prefrontalBefore })}
          ${banfeFormAreaRow({ label: 'Dorsolateral',        inputId: 'inputDLateral',         interpId: 'interpDLateral',         errorId: 'errorDLateral',         prefillArea: prefill.dLateral })}
          ${banfeFormAreaRow({ label: 'Puntaje Total', inputId: 'inputBANFETotal', interpId: 'interpBANFETotal', errorId: 'errorBANFETotal', prefillArea: prefill.scoreTotal })}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="inputBANFENotes">
              Notas
            </label>
            <div class="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#3350A9] focus-within:border-[#3350A9] bg-white overflow-hidden">
              <textarea 
                id="inputBANFENotes" 
                rows="4" 
                maxlength="200" 
                placeholder="Observaciones"
                class="w-full pl-4 pt-3 pr-4 text-sm bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 resize-none block"
              >${escapeHTML(prefill.notes)}</textarea>
              <div class="bg-white pb-2 pr-3 pt-1 flex justify-end select-none pointer-events-none">
                <span id="banfeNotesCount" class="text-xs text-gray-400">${prefill.notes.length}/200</span>
              </div>
            </div>
          </div>
          <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>
        </div>
        <div id="banfeTabInterp" class="hidden flex flex-col gap-4">
          <div class="border border-gray-200 rounded-2xl overflow-hidden">
            <div class="grid grid-cols-[120px_1fr] bg-[#3350A9]">
              <span class="px-4 py-2 text-sm font-medium text-white">Puntaje</span>
              <span class="px-4 py-2 text-sm font-medium text-white">Interpretación</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≥ 116</span>
              <span class="px-4 py-3 text-sm text-gray-900">Normal alto</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">85 – 115</span>
              <span class="px-4 py-3 text-sm text-gray-900">Normal</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">70 – 84</span>
              <span class="px-4 py-3 text-sm text-gray-900">Alteración leve-moderada</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≤ 69</span>
              <span class="px-4 py-3 text-sm text-gray-900">Alteración severa</span>
            </div>
          </div>
          <p class="text-xs text-gray-500">
            La interpretación aplica a cada área de forma independiente y al Puntaje Total.
          </p>
        </div>
        <div id="banfeActions">
          ${buildBANFEFormActions()}
        </div>
      </div>
    </div>`;
}

const BANFE_FIELDS = [
  { input: 'inputOrbitFrontal',     interp: 'interpOrbitFrontal',     error: 'errorOrbitFrontal',     key: 'score_orbit_frontal'     },
  { input: 'inputPrefrontalBefore', interp: 'interpPrefrontalBefore', error: 'errorPrefrontalBefore', key: 'score_prefrontal_before' },
  { input: 'inputDLateral',         interp: 'interpDLateral',         error: 'errorDLateral',         key: 'score_d_lateral'         },
];

function bindNotesCounter (notesInput) {
  notesInput.addEventListener('input', () => {
    notesInput.value = notesInput.value.replace(/\p{Extended_Pictographic}/gu, '');
    const len = notesInput.value.length;
    const el  = document.getElementById('banfeNotesCount');
    el.textContent = `${len} / 200`;
  });
}

function banfeBindAreaUpdates (fields) {
  fields.forEach(({ input, interp, error }) => {
    document.getElementById(input).addEventListener('input', () => {
      const el    = document.getElementById(input);
      const errEl = document.getElementById(error);
      el.value = el.value.replace(/\D/g, '').slice(0, 3);
      const capped = parseInt(el.value, 10);
      if (!isNaN(capped) && capped > 200) el.value = '200';
      errEl.classList.add('hidden');
      const n = Number(el.value);
      document.getElementById(interp).textContent = el.value === '' || isNaN(n) ? '—' : interpretBANFE(n);
    });
  });
}

async function banfeHandleSave (endpoint, fields, ctx) {
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
    } else if (isNaN(val) || val < 0 || val > 200) {
      errEl.textContent = val > 200 ? 'El puntaje no puede superar 200' : 'Ingresa un puntaje válido';
      errEl.classList.remove('hidden');
      valid = false;
    } else {
      scores.set(key, val);
    }
  });
  const totalEl    = document.getElementById('inputBANFETotal');
  const totalErrEl = document.getElementById('errorBANFETotal');
  const totalVal   = Number(totalEl.value);
  totalErrEl.textContent = '';
  totalErrEl.classList.add('hidden');
  if (totalEl.value.trim() === '') {
    totalErrEl.textContent = 'Llena todos los campos';
    totalErrEl.classList.remove('hidden');
    valid = false;
  } else if (isNaN(totalVal) || totalVal < 0 || totalVal > 600) {
    totalErrEl.textContent = totalVal > 600 ? 'El puntaje no puede superar 600' : 'Ingresa un puntaje válido';
    totalErrEl.classList.remove('hidden');
    valid = false;
  } else {
    scores.set('score_total', totalVal);
  }
  if (!valid) return;
  const notes = notesInput.value.trim() || null;
  setModalSaveBusy('btnSaveBANFE', true);
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
    console.error('[BANFE] post error:', _err);
  } finally {
    setModalSaveBusy('btnSaveBANFE', false);
  }
}

function banfeBindTotalListener () {
  document.getElementById('inputBANFETotal').addEventListener('input', () => {
    const el    = document.getElementById('inputBANFETotal');
    const errEl = document.getElementById('errorBANFETotal');
    el.value = el.value.replace(/\D/g, '').slice(0, 3);
    const capped = parseInt(el.value, 10);
    if (!isNaN(capped) && capped > 600) el.value = '600';
    errEl.classList.add('hidden');
    const n = Number(el.value);
    document.getElementById('interpBANFETotal').textContent = el.value === '' || isNaN(n) ? '—' : interpretBANFE(n);
  });
}

function bindFormListeners (idUser, idApplication, closeModal) {
  const notesInput = document.getElementById('inputBANFENotes');
  const apiError   = document.getElementById('banfeApiError');
  const endpoint   = TEST_REGISTRY[1].endpoint(idUser, idApplication);
  bindNotesCounter(notesInput);
  banfeBindAreaUpdates(BANFE_FIELDS);
  banfeBindTotalListener();
  document.getElementById('btnSaveBANFE').addEventListener(
    'click',
    () => banfeHandleSave(endpoint, BANFE_FIELDS, { notesInput, apiError, closeModal })
  );
}

async function fetchBANFEResult (idUser, idApplication, idResults) {
  try {
    const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests/1/results/${idResults}`);
    const json = await res.json();
    if (!res.ok) {
      showToast(json.error || 'No se pudieron cargar los resultados');
      return null;
    }
    return json.data;
  } catch (_err) {
    showToast('No se pudo conectar con el servidor');
    // eslint-disable-next-line no-console
    console.error('[BANFE] get error:', _err);
    return null;
  }
}

function buildBANFEPrefill (fetchedTest, needsData) {
  const areas = needsData ? (fetchedTest.areas ?? {}) : {};
  const notes = needsData ? (fetchedTest.notes ?? '') : '';
  const scoreTotal = needsData ? (fetchedTest.scoreTotal ?? '') : '';
  const interTotal = needsData ? (fetchedTest.interTotal ?? '—') : '—';
  return {
    orbitFrontal: { score: areas.orbitFrontal?.score ?? '',     interp: areas.orbitFrontal?.interpretation ?? '—' },
    prefrontalBefore: { score: areas.prefrontalBefore?.score ?? '', interp: areas.prefrontalBefore?.interpretation ?? '—' },
    dLateral: { score: areas.dLateral?.score ?? '',         interp: areas.dLateral?.interpretation ?? '—' },
    scoreTotal: { score: scoreTotal, interp: interTotal },
    notes,
  };
}

// eslint-disable-next-line no-unused-vars
async function openBANFEModal (idUser, idApplication, { test, mode }) {
  const existing = document.getElementById('modalBANFE');
  if (existing) existing.remove();
  const isConsult = mode === 'consult';
  const needsData = mode === 'modify' || isConsult;
  let fetchedTest = test;
  if (needsData) {
    const data = await fetchBANFEResult(idUser, idApplication, test.idResults);
    if (!data) return;
    fetchedTest = { ...test, ...data };
  }
  const prefill = buildBANFEPrefill(fetchedTest, needsData);
  const modal = document.createElement('div');
  modal.id        = 'modalBANFE';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult ? buildConsultHTML(fetchedTest) : buildFormHTML(mode, prefill);
  document.body.appendChild(modal);
  function closeModal () { modal.remove(); }
  document.getElementById('btnCloseBANFE').addEventListener('click', closeModal);
  document.getElementById('btnCancelBANFE').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  if (!isConsult) bindFormListeners(idUser, idApplication, closeModal);
}
