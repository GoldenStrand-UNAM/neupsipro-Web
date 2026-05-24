/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */

function interpretBANFE (score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n <= 69)   return 'Alteración severa';
  if (n <= 84)   return 'Alteración leve-moderada';
  if (n <= 115)  return 'Normal';
  return 'Normal alto';
}

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

function consultDataRow (label, content) {
  return `
    <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
      <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">${label}:</span>
      ${content}
    </div>`;
}

function buildConsultBody (test, dateLabel) {
  const areas = test.areas ?? {};
  const notes = test.notes ?? '';
  return `
    <div class="modal__body flex flex-col">
      ${consultDataRow('Fecha', `<span class="text-base sm:text-lg text-gray-900">${dateLabel}</span>`)}
      ${consultAreaRow('Orbito Frontal', areas.orbitFrontal)}
      ${consultAreaRow('Prefrontal Anterior', areas.prefrontalBefore)}
      ${consultAreaRow('Dorsolateral', areas.dLateral)}
      ${consultDataRow('Score Total', `<span class="text-base sm:text-lg text-gray-900 font-medium">${test.scoreTotal ?? '—'}</span>`)}
      ${consultDataRow('Notas', `<div class="min-w-0 overflow-hidden"><span class="text-base sm:text-lg text-gray-900 leading-relaxed break-all block">${notes ? escapeHTML(notes) : '—'}</span></div>`)}      <div class="flex justify-end pt-4 border-t border-gray-200">
        <button id="btnCancelBANFE" class="btn-cancel">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <span class="whitespace-nowrap">Cerrar</span>
        </button>
      </div>
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
      ${buildConsultBody(test, dateLabel)}
    </div>`;
}

function formAreaRow ({ label, inputId, interpId, errorId, prefillArea }) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-2xl font-regular">${label} <span class="text-red-500">*</span></label>
        <input id="${inputId}" type="number" min="0" max="200" placeholder="Puntaje"
          value="${escapeHTML(String(prefillArea.score))}"
          class="w-full h-[52px] border border-gray-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3350A9] focus:border-transparent transition"/>
        <p id="${errorId}" class="text-xs text-red-500 hidden"></p>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-2xl font-regular">Interpretación</label>
        <div class="w-full h-[52px] flex items-center border border-gray-300 rounded-lg px-4 bg-gray-50">
          <span id="${interpId}" class="text-sm text-gray-800">${escapeHTML(prefillArea.interp)}</span>
        </div>
      </div>
    </div>`;
}

function buildFormActions () {
  return `
    <div class="flex justify-end gap-3">
      <button id="btnCancelBANFE" class="btn-cancel">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
        <span class="whitespace-nowrap">Cancelar</span>
      </button>
      <button id="btnSaveBANFE" class="btn-save">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-width="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3zM15 4v5H6V4m6 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/>
        </svg>
        <span class="whitespace-nowrap">Guardar</span>
      </button>
    </div>`;
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
      <div class="modal__body flex flex-col gap-6">
        ${formAreaRow({ label: 'Orbito Frontal',      inputId: 'inputOrbitFrontal',     interpId: 'interpOrbitFrontal',     errorId: 'errorOrbitFrontal',     prefillArea: prefill.orbitFrontal })}
        ${formAreaRow({ label: 'Prefrontal Anterior', inputId: 'inputPrefrontalBefore', interpId: 'interpPrefrontalBefore', errorId: 'errorPrefrontalBefore', prefillArea: prefill.prefrontalBefore })}
        ${formAreaRow({ label: 'Dorsolateral',        inputId: 'inputDLateral',         interpId: 'interpDLateral',         errorId: 'errorDLateral',         prefillArea: prefill.dLateral })}
        <div class="flex flex-col gap-1">
          <label class="text-2xl font-regular">Puntaje Total</label>
          <div class="w-full h-[52px] flex items-center border border-gray-300 rounded-lg px-4 bg-gray-50">
            <span id="banfeScoreTotal" class="text-sm text-gray-800">—</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea id="inputBANFENotes" rows="4" maxlength="200" placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3350A9] focus:border-transparent transition resize-none"
          >${escapeHTML(prefill.notes)}</textarea>
          <p id="banfeNotesCount" class="text-lg text-gray-400 text-right">${prefill.notes.length} / 200</p>
        </div>
        <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>
        ${buildFormActions()}
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
    const len = notesInput.value.length;
    const el  = document.getElementById('banfeNotesCount');
    el.textContent = `${len} / 200`;
    el.classList.toggle('text-red-500', len >= 200);
    el.classList.toggle('text-gray-400', len < 200);
  });
}

function updateTotal (fields) {
  const values = fields.map(({ input }) => document.getElementById(input).value.trim());
  document.getElementById('banfeScoreTotal').textContent = values.every(v => v !== '')
    ? values.reduce((acc, v) => acc + Number(v), 0) : '—';
}

function bindAreaUpdates (fields) {
  fields.forEach(({ input, interp, error }) => {
    document.getElementById(input).addEventListener('input', () => {
      const el    = document.getElementById(input);
      const errEl = document.getElementById(error);
      if (!/^\d*$/.test(el.value)) el.value = el.value.replace(/\D/g, '');
      errEl.classList.add('hidden');
      const n = Number(el.value);
      document.getElementById(interp).textContent = el.value === '' || isNaN(n) ? '—' : interpretBANFE(n);
      updateTotal(fields);
    });
  });
}

async function handleSave (endpoint, fields, ctx) {
  const { notesInput, apiError, closeModal } = ctx;
  apiError.classList.add('hidden');
  let valid = true;
  const scores = new Map();
  fields.forEach(({ input, error, key }) => {
    const el    = document.getElementById(input);
    const errEl = document.getElementById(error);
    const val   = Number(el.value);
    if (el.value.trim() === '' || isNaN(val) || val < 0 || val > 200) {
      errEl.textContent = val > 200 ? 'El puntaje no puede superar 200' : 'Ingresa un puntaje válido';
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
    console.error('[BANFE] post error:', _err);
  }
}

function bindFormListeners (idUser, idApplication, closeModal) {
  const notesInput = document.getElementById('inputBANFENotes');
  const apiError   = document.getElementById('banfeApiError');
  const endpoint   = TEST_REGISTRY[1].endpoint(idUser, idApplication);
  bindNotesCounter(notesInput);
  bindAreaUpdates(BANFE_FIELDS);
  document.getElementById('btnSaveBANFE').addEventListener(
    'click',
    () => handleSave(endpoint, BANFE_FIELDS, { notesInput, apiError, closeModal })
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

function buildPrefill (fetchedTest, needsData) {
  const areas = needsData ? (fetchedTest.areas ?? {}) : {};
  const notes = needsData ? (fetchedTest.notes ?? '') : '';
  return {
    orbitFrontal: { score: areas.orbitFrontal?.score ?? '',     interp: areas.orbitFrontal?.interpretation ?? '—' },
    prefrontalBefore: { score: areas.prefrontalBefore?.score ?? '', interp: areas.prefrontalBefore?.interpretation ?? '—' },
    dLateral: { score: areas.dLateral?.score ?? '',         interp: areas.dLateral?.interpretation ?? '—' },
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
  const prefill = buildPrefill(fetchedTest, needsData);
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
