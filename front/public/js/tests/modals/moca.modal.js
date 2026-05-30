/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */

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

// ── CONSULT VIEW ─────────────────────────────────────────────────────────────
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
        <h2 class="modal__title">MOCA</h2>
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

// ── Tab switching ─────────────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
function switchMOCATab (tab) {
  const formContent   = document.getElementById('mocaTabForm');
  const interpContent = document.getElementById('mocaTabInterp');
  const tabForm       = document.getElementById('mocaTabBtnForm');
  const tabInterp     = document.getElementById('mocaTabBtnInterp');
  const actions       = document.getElementById('mocaActions');
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

// ── REGISTER AND MODIFY ────────────────────────────────────────────────────────────────
// Shared HTML for register and modify modes.
// schoolingYears is used to show the bonus banner.
// prefill comes pre-built from openMOCAModal — empty on register,
// existing values on modify.

function buildMOCAFormHTML (mode, prefill, schoolingData) {
  const title        = mode === 'register' ? 'Registrar' : 'Modificar';
  const hasSchooling = schoolingData !== null;

  // Bonus applies when schooling <= 12 years
  const bonusApplies = hasSchooling && schoolingData.years <= 12;

  // Schooling banner — shows education level and whether bonus applies
  const schoolingBanner = hasSchooling ? `
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl
                ${bonusApplies ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke-width="1.5" stroke="currentColor"
           class="w-5 h-5 shrink-0 ${bonusApplies ? 'text-blue-500' : 'text-gray-400'}">
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
      <div class="flex flex-col">
        <span class="text-sm font-medium ${bonusApplies ? 'text-blue-700' : 'text-gray-700'}">
          Escolaridad: ${escapeHTML(schoolingData.schooling)}
          (${schoolingData.years} años)
        </span>
        <span class="text-xs ${bonusApplies ? 'text-blue-500' : 'text-gray-400'}">
          ${bonusApplies
    ? 'Aplica bono +2 puntos si puntaje bruto ≤ 28'
    : 'No aplica bono de escolaridad'}
        </span>
      </div>
    </div>` : `
    <div class="flex items-center gap-3 px-4 py-3 rounded-xl
                bg-yellow-50 border border-yellow-200">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke-width="1.5" stroke="currentColor" class="w-5 h-5 shrink-0 text-yellow-500">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
      </svg>
      <span class="text-sm text-yellow-700">
        Sin datos de escolaridad registrados — no se puede calcular bono
      </span>
    </div>`;

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">MOCA — ${title}</h2>
        <button id="btnCloseMOCA" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="flex border-b border-gray-200">
        <button id="mocaTabBtnForm"
          onclick="switchMOCATab('form')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-[#3350A9] border-b-2 border-[#3350A9] cursor-pointer transition-colors">
          Prueba
        </button>
        <button id="mocaTabBtnInterp"
          onclick="switchMOCATab('interp')"
          class="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium
                 text-gray-400 border-b-2 border-transparent cursor-pointer hover:text-gray-600 transition-colors">
          Interpretación
        </button>
      </div>

      <div class="modal__body flex flex-col gap-4">

        <div id="mocaTabForm" class="flex flex-col gap-4">

          ${schoolingBanner}

          <!-- Score bruto + puntaje final en vivo -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">
                Puntaje bruto <span class="text-red-500">*</span>
              </label>
              <input
                id="inputMOCAScore"
                type="text"
                inputmode="numeric"
                placeholder="0 – 30"
                value="${escapeHTML(String(prefill.score))}"
                class="w-full h-[40px] border border-gray-300 rounded-lg px-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                       focus:border-transparent transition"/>
              <p class="text-xs text-gray-400">Número entero entre 0 y 30</p>
              <p id="errorMOCAScore" class="text-xs text-red-500 hidden"></p>
            </div>

            <!-- Puntaje final — computed live from raw + bonus -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-700">Puntaje final</label>
              <div class="w-full h-[40px] flex items-center
                          border border-gray-300 rounded-lg px-3 bg-gray-50">
                <span id="mocaFinalScore" class="text-sm text-gray-800">—</span>
              </div>
            </div>

          </div>

          <!-- Interpretación en vivo -->
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium text-gray-700">Interpretación</label>
            <div class="w-full h-[40px] flex items-center
                        border border-gray-300 rounded-lg px-3 bg-gray-50">
              <span id="mocaInterpretation" class="text-sm text-gray-800">—</span>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2" for="inputMOCANotes">
              Notas
            </label>
            <div class="w-full border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#3350A9] focus-within:border-[#3350A9] bg-white overflow-hidden">
              <textarea 
                id="inputMOCANotes" 
                rows="2" 
                maxlength="200" 
                placeholder="Observaciones"
                class="w-full pl-4 pt-3 pr-4 text-sm bg-transparent border-none outline-none focus:outline-none focus:border-none focus:ring-0 resize-none block"
              >${escapeHTML(prefill.notes)}</textarea>
              <div class="bg-white pb-2 pr-3 pt-1 flex justify-end select-none pointer-events-none">
                <span id="mocaNotesCount" class="text-xs text-gray-400">${prefill.notes.length}/200</span>
              </div>
            </div>
          </div>

          <p id="mocaApiError" class="text-xs text-red-500 hidden"></p>

        </div>

        <div id="mocaTabInterp" class="hidden flex flex-col gap-4">

          <div class="border border-gray-200 rounded-2xl overflow-hidden">
            <div class="grid grid-cols-[120px_1fr] bg-[#3350A9]">
              <span class="px-4 py-2 text-sm font-medium text-white">Puntaje final</span>
              <span class="px-4 py-2 text-sm font-medium text-white">Interpretación</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≥ 26</span>
              <span class="px-4 py-3 text-sm text-gray-900">Rendimiento cognitivo normal</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">18 – 25</span>
              <span class="px-4 py-3 text-sm text-gray-900">Deterioro cognitivo leve</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">10 – 17</span>
              <span class="px-4 py-3 text-sm text-gray-900">Deterioro cognitivo moderado</span>
            </div>
            <div class="grid grid-cols-[120px_1fr] border-t border-gray-200">
              <span class="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50">≤ 9</span>
              <span class="px-4 py-3 text-sm text-gray-900">Deterioro cognitivo grave</span>
            </div>
          </div>

          <div class="border border-blue-200 rounded-xl bg-blue-50 px-4 py-3">
            <p class="text-sm font-medium text-gray-700 mb-1">Bono de escolaridad</p>
            <p class="text-sm text-gray-600">
              Se suman 2 puntos al puntaje bruto cuando el paciente tiene 12 años o menos de escolaridad Y el puntaje bruto es ≤ 28. El puntaje final se limita a un máximo de 30.
            </p>
          </div>

          <p class="text-xs text-gray-500">
            El servidor recalcula el puntaje final y la interpretación al guardar — los valores mostrados en vivo son solo orientativos.
          </p>

        </div>

        <!-- Actions -->
        <div id="mocaActions" class="flex gap-3">

          <button id="btnCancelMOCA"
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

          <button id="btnSaveMOCA" class="btn-save">
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

// ── Logic for interpretation and schooling ───────────────────────────────────────────────────────────
// Wires up live final score + interpretation, notes counter,
// validation, and the save fetch for register/modify modes.
// schoolingYears is passed in to mirror the server-side bonus logic.

function bindMOCAFormListeners (idUser, idApplication, schoolingYears, closeModal) {

  const scoreInput  = document.getElementById('inputMOCAScore');
  const finalScore  = document.getElementById('mocaFinalScore');
  const interp      = document.getElementById('mocaInterpretation');
  const scoreError  = document.getElementById('errorMOCAScore');
  const notesInput  = document.getElementById('inputMOCANotes');
  const notesCount  = document.getElementById('mocaNotesCount');
  const apiError    = document.getElementById('mocaApiError');

  // ── Notes counter ──────────────────────────────────────────────────────────

  notesInput.addEventListener('input', () => {
    notesInput.value = notesInput.value.replace(/\p{Extended_Pictographic}/gu, '');
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
  });

  // ── Live final score + interpretation ─────────────────────────────────────
  // Mirrors server-side logic — display only, never sent to server.

  scoreInput.addEventListener('input', () => {
    scoreError.classList.add('hidden');
    scoreInput.value = scoreInput.value.replace(/\D/g, '').slice(0, 2);
    const capped = parseInt(scoreInput.value, 10);
    if (!isNaN(capped) && capped > 30) scoreInput.value = '30';

    const raw = Number(scoreInput.value);
    if (scoreInput.value === '' || isNaN(raw)) {
      finalScore.textContent = '—';
      interp.textContent     = '—';
      return;
    }

    const computed = resolveMOCAFinalScore(raw, schoolingYears);
    finalScore.textContent = computed;
    interp.textContent     = interpretMOCA(computed);
  });

  // ── Save ───────────────────────────────────────────────────────────────────

  document.getElementById('btnSaveMOCA').addEventListener('click', async () => {
    apiError.classList.add('hidden');
    scoreError.classList.add('hidden');

    const raw = Number(scoreInput.value);

    // Client-side validation — server recalculates everything independently
    if (scoreInput.value.trim() === '') {
      scoreError.textContent = 'Llena todos los campos';
      scoreError.classList.remove('hidden');
      return;
    }
    if (isNaN(raw) || raw < 0 || raw > 30) {
      scoreError.textContent = 'Ingresa un puntaje válido';
      scoreError.classList.remove('hidden');
      return;
    }

    const notes  = notesInput.value.trim() || null;
    const config = TEST_REGISTRY[4];

    try {
      const res = await fetch(config.endpoint(idUser, idApplication), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
        // Send raw score — server applies bonus and interpretation
        body: JSON.stringify({ score: raw, notes }),
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
      console.error('[MOCA] post error:', _err);
    }
  });
}

// ── Close and open modal ──────────────────────────────────────────────────────────────
// Fetches schooling before opening any mode — needed for bonus display.
// In modify/consult also fetches existing result first.
// Register mode skips result fetch — prefill is empty.

// eslint-disable-next-line no-unused-vars
async function openMOCAModal ({ idUser, idApplication, test, mode }) {
  const existing = document.getElementById('modalMOCA');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  // ── Fetch schooling — needed in all modes for banner and bonus ────────────

  let schoolingData = null;

  try {
    const res  = await fetch(`/api/users/${idUser}/schooling`);
    const json = await res.json();
    if (res.ok) schoolingData = json;
  } catch (_err) {
    // eslint-disable-next-line no-console
    console.error('[MOCA] schooling fetch error:', _err);
  }

  const schoolingYears = schoolingData?.years ?? null;

  // ── Fetch existing result before opening modify/consult ───────────────────

  let fetchedTest = test;

  if (isModify || isConsult) {
    try {
      const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests/4/results/${test.idResults}`);
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
      console.error('[MOCA] get error:', _err);
      return;
    }
  }

  // ── Build prefill from fetched data ──────────────────────────────────────

  const prefill = {
    score: (isModify || isConsult) ? (fetchedTest.score ?? '') : '',
    notes: (isModify || isConsult) ? (fetchedTest.notes ?? '') : '',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const modal = document.createElement('div');
  modal.id        = 'modalMOCA';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildMOCAConsultHTML(fetchedTest)
    : buildMOCAFormHTML(mode, prefill, schoolingData);

  document.body.appendChild(modal);

  // ── Shared close logic ────────────────────────────────────────────────────

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseMOCA').addEventListener('click', closeModal);
  document.getElementById('btnCancelMOCA').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ── Form listeners only on register / modify ──────────────────────────────

  if (!isConsult) {
    bindMOCAFormListeners(idUser, idApplication, schoolingYears, closeModal);
  }
}
