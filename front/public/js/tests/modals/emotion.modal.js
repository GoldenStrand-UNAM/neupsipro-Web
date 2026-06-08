/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */

const EMOTION_DETAILS_URL = 'https://docs.google.com/spreadsheets/d/1PRgsCTIlptxGim8Y5SMo5td9j6qVZl1ABhM_QeO4rcc/edit?usp=sharing';

// ── Interpretation functions ─────────────────────────────────────────────────

function interpretAnxietyBeck (score) {
  const n = Number(score);
  if (isNaN(n)) return '';
  if (n <= 5)  return 'Mínima';
  if (n <= 15) return 'Leve';
  if (n <= 30) return 'Moderada';
  return 'Grave';
}

function interpretDepressionBeck (score) {
  const n = Number(score);
  if (isNaN(n)) return '';
  if (n <= 13) return 'Mínima';
  if (n <= 19) return 'Leve';
  if (n <= 28) return 'Moderada';
  return 'Grave';
}

// ── Tab switching ─────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
function switchEmotionTab (tab) {
  const formContent   = document.getElementById('emotionTabForm');
  const interpContent = document.getElementById('emotionTabInterp');
  const tabForm       = document.getElementById('emotionTabBtnForm');
  const tabInterp     = document.getElementById('emotionTabBtnInterp');
  const actions       = document.getElementById('emotionActions');

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

// ── CONSULT VIEW ─────────────────────────────────────────────────────────────

function buildEmotionConsultHTML (test) {
  const notes = test.notes ?? '';

  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—';

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">Cuestionario SE</h2>
        <button id="btnCloseEmotion" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col">

        <!-- Fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="shrink-0 text-gray-400 text-base">Fecha:</span>
          <span class="text-base text-gray-900">${dateLabel}</span>
        </div>

        <!-- IAB puntaje -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="shrink-0 text-gray-400 text-base">IAB — Puntaje:</span>
          <span class="text-base text-gray-900 font-medium">
            ${test.scoreAnxietyBeck ?? '—'}
          </span>
        </div>

        <!-- IAB interpretación -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="shrink-0 text-gray-400 text-base">IAB — Interpretación:</span>
          <span class="text-base text-gray-900 font-medium">
            ${escapeHTML(test.interAnxietyBeck ?? '—')}
          </span>
        </div>

        <!-- IDB puntaje -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="shrink-0 text-gray-400 text-base">IDB — Puntaje:</span>
          <span class="text-base text-gray-900 font-medium">
            ${test.scoreDepressionBeck ?? '—'}
          </span>
        </div>

        <!-- IDB interpretación -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="shrink-0 text-gray-400 text-base">IDB — Interpretación:</span>
          <span class="text-base text-gray-900 font-medium">
            ${escapeHTML(test.interDepressionBeck ?? '—')}
          </span>
        </div>

        <!-- Notes -->
        <div class="grid grid-cols-1 sm:grid-cols-[220px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <div class="flex flex-col gap-1 shrink-0">
            <span class="text-gray-400 text-base">
              Interp. SCL-90, SF-36, WHODAS 2.0, COPE-28, CRIq:
            </span>
            <a href="${EMOTION_DETAILS_URL}" target="_blank" rel="noopener noreferrer"
               class="text-xs text-[#3350A9] underline hover:text-blue-700 transition-colors">
              Ver detalles
            </a>
          </div>
          <span class="text-base text-gray-900 leading-relaxed break-words whitespace-pre-wrap">
            ${notes ? escapeHTML(notes) : '—'}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelEmotion"
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

// ── REGISTER / MODIFY FORM ────────────────────────────────────────────────────

function buildEmotionFormHTML (mode, prefill) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">Cuestionario SE — ${title}</h2>
        <button id="btnCloseEmotion" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button id="emotionTabBtnForm"
          onclick="switchEmotionTab('form')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-[#3350A9] border-b-2 border-[#3350A9] cursor-pointer transition-colors">
          Prueba
        </button>
        <button id="emotionTabBtnInterp"
          onclick="switchEmotionTab('interp')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-gray-400 border-b-2 border-transparent cursor-pointer
                 hover:text-gray-600 transition-colors">
          Interpretación
        </button>
      </div>

      <div class="modal__body flex flex-col gap-4">

        <!-- ── Tab: Prueba ── -->
        <div id="emotionTabForm" class="flex flex-col gap-4">

          <!-- IAB -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                Inventario de ansiedad de Beck <span class="text-red-500">*</span>
              </label>
              <input
                id="inputAnxietyBeck"
                type="text"
                inputmode="decimal"
                placeholder="0 – 100"
                value="${escapeHTML(String(prefill.scoreAnxietyBeck))}"
                class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                       focus:border-transparent transition"/>
              <p class="text-xs text-gray-400">Número entre 0 y 100 (decimal permitido)</p>
              <p id="errorAnxietyBeck" class="text-xs text-red-500 hidden"></p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">Interpretación IAB</label>
              <div class="w-full h-[40px] flex items-center
                          border border-gray-300 rounded-lg px-3 bg-gray-50">
                <span id="interpAnxietyBeck" class="text-sm text-gray-800">—</span>
              </div>
            </div>
          </div>

          <!-- IDB -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                Inventario de depresión de Beck <span class="text-red-500">*</span>
              </label>
              <input
                id="inputDepressionBeck"
                type="text"
                inputmode="decimal"
                placeholder="0 – 100"
                value="${escapeHTML(String(prefill.scoreDepressionBeck))}"
                class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                       focus:border-transparent transition"/>
              <p class="text-xs text-gray-400">Número entre 0 y 100 (decimal permitido)</p>
              <p id="errorDepressionBeck" class="text-xs text-red-500 hidden"></p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">Interpretación IDB</label>
              <div class="w-full h-[40px] flex items-center
                          border border-gray-300 rounded-lg px-3 bg-gray-50">
                <span id="interpDepressionBeck" class="text-sm text-gray-800">—</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <label class="text-sm font-medium text-gray-700" for="inputEmotionNotes">
                Interpretación SCL-90, SF-36, WHODAS 2.0, COPE-28, CRIq
              </label>
              <a href="${EMOTION_DETAILS_URL}" target="_blank" rel="noopener noreferrer"
                 class="shrink-0 text-xs px-2 py-1 rounded-lg border border-[#3350A9]
                        text-[#3350A9] hover:bg-blue-50 transition-colors">
                Ver detalles
              </a>
            </div>
            <div class="w-full border border-gray-300 rounded-lg
                        focus-within:ring-2 focus-within:ring-[#3350A9]
                        focus-within:border-[#3350A9] bg-white overflow-hidden">
              <textarea
                id="inputEmotionNotes"
                rows="3"
                maxlength="2000"
                placeholder="Observaciones"
                class="w-full pl-4 pt-3 pr-4 text-sm bg-transparent border-none outline-none
                       focus:outline-none focus:border-none focus:ring-0 resize-none block"
              >${escapeHTML(prefill.notes)}</textarea>
              <div class="bg-white pb-2 pr-3 pt-1 flex justify-end select-none pointer-events-none">
                <span id="emotionNotesCount" class="text-xs text-gray-400">${prefill.notes.length}/2000</span>
              </div>
            </div>
          </div>

          <p id="emotionApiError" class="text-xs text-red-500 hidden"></p>

        </div>

        <!-- ── Tab: Interpretación ── -->
        <div id="emotionTabInterp" class="hidden flex flex-col gap-4">

          <h3 class="text-sm font-semibold text-gray-800 uppercase tracking-wide">
            Perfil de Adaptación Socioemocional a la Discapacidad
          </h3>

          <p class="text-xs text-gray-600 leading-relaxed">
            (1) Inventario de Ansiedad de Beck (IAB); (2) Inventario de Depresión de Beck (IDB);
            (3) Lista de Verificación de 90 Síntomas Revisada (SCL-90-R); (4) Encuesta de Salud de
            Formato Corto (SF-36); (5) Cuestionario de Evaluación de la Discapacidad de la
            Organización Mundial de la Salud (WHODAS 2.0); (6) Cuestionario Breve de Afrontamiento
            al Estrés (COPE-28); (7) Cuestionario de Reserva Cognitiva 2.0 (CRIq).
          </p>

          <!-- IAB table -->
          <div>
            <p class="text-sm font-medium text-gray-700 mb-2">IAB — Inventario de Ansiedad de Beck</p>
            <div class="border border-gray-200 rounded-2xl overflow-hidden">
              <div class="grid grid-cols-[120px_1fr] bg-[#3350A9]">
                <span class="px-4 py-2 text-sm font-medium text-white">Puntaje</span>
                <span class="px-4 py-2 text-sm font-medium text-white">Interpretación</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">0 – 5</span>
                <span class="px-4 py-3 text-sm text-gray-900">Mínima</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">6 – 15</span>
                <span class="px-4 py-3 text-sm text-gray-900">Leve</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">16 – 30</span>
                <span class="px-4 py-3 text-sm text-gray-900">Moderada</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≥ 31</span>
                <span class="px-4 py-3 text-sm text-gray-900">Grave</span>
              </div>
            </div>
          </div>

          <!-- IDB table -->
          <div>
            <p class="text-sm font-medium text-gray-700 mb-2">IDB — Inventario de Depresión de Beck</p>
            <div class="border border-gray-200 rounded-2xl overflow-hidden">
              <div class="grid grid-cols-[120px_1fr] bg-[#3350A9]">
                <span class="px-4 py-2 text-sm font-medium text-white">Puntaje</span>
                <span class="px-4 py-2 text-sm font-medium text-white">Interpretación</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">0 – 13</span>
                <span class="px-4 py-3 text-sm text-gray-900">Mínima</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">14 – 19</span>
                <span class="px-4 py-3 text-sm text-gray-900">Leve</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">20 – 28</span>
                <span class="px-4 py-3 text-sm text-gray-900">Moderada</span>
              </div>
              <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
                <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≥ 29</span>
                <span class="px-4 py-3 text-sm text-gray-900">Grave</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Actions -->
        <div id="emotionActions" class="flex gap-3">

          <button id="btnCancelEmotion" class="btn-cancel">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <span class="whitespace-nowrap">Cancelar</span>
          </button>

          <button id="btnSaveEmotion" class="btn-save">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-width="1.5"
                    d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3zM15 4v5H6V4m6 14a3 3 0 1 1 0-6a3 3 0 0 1 0 6z"/>
            </svg>
            <span class="whitespace-nowrap">Guardar</span>
          </button>

        </div>
      </div>
    </div>`;
}

// ── Form listeners ────────────────────────────────────────────────────────────

function bindEmotionFormListeners (idUser, idApplication, closeModal) {

  const anxietyInput     = document.getElementById('inputAnxietyBeck');
  const interpAnxiety    = document.getElementById('interpAnxietyBeck');
  const errorAnxiety     = document.getElementById('errorAnxietyBeck');
  const depressionInput  = document.getElementById('inputDepressionBeck');
  const interpDepression = document.getElementById('interpDepressionBeck');
  const errorDepression  = document.getElementById('errorDepressionBeck');
  const notesInput       = document.getElementById('inputEmotionNotes');
  const notesCount       = document.getElementById('emotionNotesCount');
  const apiError         = document.getElementById('emotionApiError');

  // ── Live interpretation — IAB ──────────────────────────────────────────────

  anxietyInput.addEventListener('input', () => {
    errorAnxiety.classList.add('hidden');
    anxietyInput.value = anxietyInput.value.replace(/[^0-9.]/g, '');
    const parts = anxietyInput.value.split('.');
    if (parts.length > 2) anxietyInput.value = `${parts[0]  }.${  parts.slice(1).join('')}`;
    const n = parseFloat(anxietyInput.value);
    if (!isNaN(n) && n > 100) anxietyInput.value = '100';
    interpAnxiety.textContent = (anxietyInput.value.trim() === '' || isNaN(parseFloat(anxietyInput.value)))
      ? '—'
      : interpretAnxietyBeck(parseFloat(anxietyInput.value));
  });

  // ── Live interpretation — IDB ──────────────────────────────────────────────

  depressionInput.addEventListener('input', () => {
    errorDepression.classList.add('hidden');
    depressionInput.value = depressionInput.value.replace(/[^0-9.]/g, '');
    const parts = depressionInput.value.split('.');
    if (parts.length > 2) depressionInput.value = `${parts[0]  }.${  parts.slice(1).join('')}`;
    const n = parseFloat(depressionInput.value);
    if (!isNaN(n) && n > 100) depressionInput.value = '100';
    interpDepression.textContent = (depressionInput.value.trim() === '' || isNaN(parseFloat(depressionInput.value)))
      ? '—'
      : interpretDepressionBeck(parseFloat(depressionInput.value));
  });

  // ── Notes counter ──────────────────────────────────────────────────────────

  notesInput.addEventListener('input', () => {
    notesInput.value = notesInput.value.replace(/\p{Extended_Pictographic}/gu, '');
    notesCount.textContent = `${notesInput.value.length} / 2000`;
  });

  // ── Save ───────────────────────────────────────────────────────────────────

  document.getElementById('btnSaveEmotion').addEventListener('click', async () => {
    apiError.classList.add('hidden');
    errorAnxiety.classList.add('hidden');
    errorDepression.classList.add('hidden');

    const anxietyNum    = parseFloat(anxietyInput.value.trim());
    const depressionNum = parseFloat(depressionInput.value.trim());
    let valid = true;

    if (anxietyInput.value.trim() === '' || isNaN(anxietyNum)) {
      errorAnxiety.textContent = 'Ingresa un puntaje válido';
      errorAnxiety.classList.remove('hidden');
      valid = false;
    } else if (anxietyNum < 0 || anxietyNum > 100) {
      errorAnxiety.textContent = 'El puntaje debe estar entre 0 y 100';
      errorAnxiety.classList.remove('hidden');
      valid = false;
    }

    if (depressionInput.value.trim() === '' || isNaN(depressionNum)) {
      errorDepression.textContent = 'Ingresa un puntaje válido';
      errorDepression.classList.remove('hidden');
      valid = false;
    } else if (depressionNum < 0 || depressionNum > 100) {
      errorDepression.textContent = 'El puntaje debe estar entre 0 y 100';
      errorDepression.classList.remove('hidden');
      valid = false;
    }

    if (!valid) return;

    const notes  = notesInput.value.trim() || null;
    const config = TEST_REGISTRY[6];

    try {
      const res = await fetch(config.endpoint(idUser, idApplication), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
        body: JSON.stringify({
          score_anxiety_beck: anxietyNum,
          score_depression_beck: depressionNum,
          notes,
        }),
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
      console.error('[Emotion] post error:', _err);
    }
  });
}

// ── Open modal ────────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
async function openEmotionModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalEmotion');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  let fetchedTest = test;

  if (isModify || isConsult) {
    try {
      const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests/6/results/${test.idResults}`);
      const json = await res.json();

      if (!res.ok) {
        showToast(json.error || 'No se pudieron cargar los resultados');
        return;
      }

      fetchedTest = { ...test, ...json.data };

    } catch (_err) {
      showToast('No se pudo conectar con el servidor');
      // eslint-disable-next-line no-console
      console.error('[Emotion] get error:', _err);
      return;
    }
  }

  const prefill = {
    scoreAnxietyBeck: (isModify || isConsult) ? (fetchedTest.scoreAnxietyBeck    ?? '') : '',
    scoreDepressionBeck: (isModify || isConsult) ? (fetchedTest.scoreDepressionBeck ?? '') : '',
    notes: (isModify || isConsult) ? (fetchedTest.notes               ?? '') : '',
  };

  const modal = document.createElement('div');
  modal.id        = 'modalEmotion';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildEmotionConsultHTML(fetchedTest)
    : buildEmotionFormHTML(mode, prefill);

  document.body.appendChild(modal);

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseEmotion').addEventListener('click', closeModal);
  document.getElementById('btnCancelEmotion').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  if (!isConsult) {
    // Seed live interpretation for prefilled modify values
    if (prefill.scoreAnxietyBeck !== '') {
      document.getElementById('interpAnxietyBeck').textContent =
        interpretAnxietyBeck(Number(prefill.scoreAnxietyBeck));
    }
    if (prefill.scoreDepressionBeck !== '') {
      document.getElementById('interpDepressionBeck').textContent =
        interpretDepressionBeck(Number(prefill.scoreDepressionBeck));
    }

    bindEmotionFormListeners(idUser, idApplication, closeModal);
  }
}
