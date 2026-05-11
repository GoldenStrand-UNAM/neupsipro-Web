/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

function resolveSchoolingYears (schooling) {
  const map = {
    'Sin escolaridad': 0,
    'Primaria': 6,
    'Secundaria': 9,
    'Bachillerato': 12,
    'Licenciatura': 16,
    'Posgrado': 18,
  };
  return map[schooling] ?? null;
}

function resolveMOCAFinalScore (raw, schoolingYears) {
  let final = raw;
  if (schoolingYears !== null && schoolingYears <= 12 && raw <= 28) {
    final = raw + 2;
  }
  return Math.min(final, 30);
}

function interpretMOCA (finalScore) {
  if (finalScore >= 26) return 'Rendimiento cognitivo normal';
  if (finalScore >= 18) return 'Deterioro cognitivo leve';
  if (finalScore >= 10) return 'Deterioro cognitivo moderado';
  return 'Deterioro cognitivo grave';
}

// eslint-disable-next-line no-unused-vars
async function openMOCAModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalMOCA');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  const prefillScore = (isModify || isConsult) ? (test.score ?? '') : '';
  const prefillNotes = (isModify || isConsult) ? (test.notes ?? '') : '';
  const prefillInterp = prefillScore !== ''
    ? interpretMOCA(Number(prefillScore))
    : '—';

  const titles = { register: 'Registrar', modify: 'Modificar', consult: 'Consultar' };

  const modal = document.createElement('div');
  modal.id        = 'modalMOCA';
  modal.className = 'modal-overlay';

  // ── Consult mode — same structure as BANFE consult ──────────────────────
  modal.innerHTML = isConsult ? `
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

        <!-- Row: Fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6
                    py-5
                    border-b border-gray-200
                    items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Fecha:</span>
          <span class="text-base sm:text-lg text-gray-900">
            ${test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—'}
          </span>
        </div>

        <!-- Row: Puntaje -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6
                    py-5
                    border-b border-gray-200
                    items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Puntaje:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${test.score !== null ? escapeHTML(String(test.score)) : '—'}
          </span>
        </div>

        <!-- Row: Interpretación -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6
                    py-5
                    border-b border-gray-200
                    items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Interpretación:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${escapeHTML(prefillInterp)}
          </span>
        </div>

        <!-- Row: Notas -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6
                    py-5
                    border-b border-gray-200
                    items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-words">
            ${prefillNotes ? escapeHTML(prefillNotes) : '—'}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelMOCA"
            class="flex items-center gap-3 px-6 py-3
                   border border-gray-300 rounded-2xl
                   text-base hover:bg-gray-50
                   transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            Cerrar
          </button>
        </div>

      </div>
    </div>

  ` :

  // ── Register / Modify mode ────────────────────────────────────────────────
    `
    <div class="modal">

      <div class="modal__header">
        <h2 class="modal__title">MoCA — ${titles[mode]}</h2>
        <button id="btnCloseMOCA" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-6">

        <!-- Schooling banner -->
        <div id="MOCASchoolingBanner"
             class="flex items-center gap-3 px-4 py-3 bg-gray-50
                    border border-gray-200 rounded-xl text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor"
               class="w-5 h-5 shrink-0 text-[#3350A9]">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1
                     12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491
                     -6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906
                     0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84
                     c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1
                     12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0
                     1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0
                     1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"/>
          </svg>
          <span id="MOCASchoolingText">Cargando escolaridad...</span>
        </div>

        <!-- Score row -->
        <div class="flex flex-col md:flex-row gap-4">

          <!-- Raw score -->
          <div class="flex-1 flex flex-col gap-1 min-w-0">
            <label class="text-2xl font-regular">
              Puntaje bruto <span class="text-red-500">*</span>
            </label>
            <input
              id="inputMOCAScore"
              type="number"
              min="0"
              max="30"
              placeholder="0 – 30"
              value="${escapeHTML(String(prefillScore))}"
              class="w-full h-[52px]
                     border border-gray-300
                     rounded-lg px-4
                     text-sm
                     focus:outline-none
                     focus:ring-2
                     focus:ring-[#3350A9]
                     focus:border-transparent
                     transition"/>
            <p class="text-xs text-gray-400">Número entero entre 0 y 30</p>
            <p id="MOCAScoreError" class="text-xs text-red-500 hidden"></p>
          </div>

          <!-- Final score -->
          <div class="flex-1 flex flex-col gap-1 min-w-0">
            <label class="text-2xl font-regular">Puntaje final</label>
            <div class="w-full h-[52px]
                        flex items-center
                        border border-gray-300
                        rounded-lg px-4
                        bg-gray-50">
              <span id="MOCAFinalScore" class="text-sm text-gray-800">—</span>
            </div>
            <p class="text-xs text-gray-400">Con bono si aplica</p>
          </div>

        </div>

        <!-- Interpretation — own row below scores -->
        <div class="flex flex-col gap-1">
          <label class="text-2xl font-regular">Interpretación</label>
          <div class="w-full h-[52px]
                      flex items-center
                      border border-gray-300
                      rounded-lg px-4
                      bg-gray-50">
            <span id="MOCAInterpretation" class="text-sm text-gray-800">—</span>
          </div>
        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea
            id="inputMOCANotes"
            rows="4"
            maxlength="200"
            placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          >${escapeHTML(prefillNotes)}</textarea>
          <p id="MOCANotesCount" class="text-lg text-gray-400 text-right">
            ${String(prefillNotes).length} / 200
          </p>
        </div>

        <p id="MOCAApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex gap-3">

          <button id="btnCancelMOCA"
            class="flex-1 flex items-center justify-center gap-3
                   px-4 py-3
                   border border-gray-300
                   rounded-2xl font-regular
                   hover:bg-gray-50
                   transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <span class="whitespace-nowrap">Cancelar</span>
          </button>

          <button id="btnSaveMOCA"
            class="flex-1 flex items-center justify-center gap-3
                   px-4 py-3
                   rounded-2xl bg-[#3350A9]
                   text-white font-regular
                   hover:bg-[#2a4190]
                   transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-8H7v8"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 3v5h8"/>
            </svg>
            <span class="whitespace-nowrap">Guardar</span>
          </button>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const scoreInput      = document.getElementById('inputMOCAScore');
  const finalScoreLabel = document.getElementById('MOCAFinalScore');
  const interpretLabel  = document.getElementById('MOCAInterpretation');
  const scoreError      = document.getElementById('MOCAScoreError');
  const apiError        = document.getElementById('MOCAApiError');
  const notesInput      = document.getElementById('inputMOCANotes');
  const notesCount      = document.getElementById('MOCANotesCount');
  const schoolingText   = document.getElementById('MOCASchoolingText');

  // Schooling years — fetched async, used for live bonus calculation
  let schoolingYears = null;

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseMOCA').addEventListener('click', closeModal);
  document.getElementById('btnCancelMOCA').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // Consult mode has no inputs — exit early after attaching close handlers
  if (isConsult) return;

  // ── Fetch schooling ───────────────────────────────────────────────────────
  const config = TEST_REGISTRY[4];

  try {
    const sRes  = await fetch(config.schoolingEndpoint(idUser));
    const sJson = await sRes.json();
    schoolingYears = sJson.years;

    if (sJson.schooling) {
      const bonusNote = schoolingYears !== null && schoolingYears <= 12
        ? ' — aplica bono de +2 puntos'
        : ' — no aplica bono';
      schoolingText.textContent =
        `Escolaridad: ${sJson.schooling} (${schoolingYears ?? '?'} años)${bonusNote}`;
    } else {
      schoolingText.textContent = 'Sin datos de escolaridad registrados';
    }
  } catch {
    schoolingText.textContent = 'No se pudo cargar la escolaridad';
  }

  // ── Notes counter ─────────────────────────────────────────────────────────
  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });

  // ── Live score + interpretation ───────────────────────────────────────────
  function updateLiveScores () {
    scoreError.classList.add('hidden');

    // Strip non-digits
    if (!/^\d*$/.test(scoreInput.value)) {
      scoreInput.value = scoreInput.value.replace(/\D/g, '');
    }

    const raw = Number(scoreInput.value);

    if (scoreInput.value === '' || isNaN(raw)) {
      finalScoreLabel.textContent = '—';
      interpretLabel.textContent  = '—';
      return;
    }

    if (raw > 30) {
      finalScoreLabel.textContent = '—';
      interpretLabel.textContent  = '—';
      scoreError.textContent = 'El puntaje debe estar entre 0 y 30';
      scoreError.classList.remove('hidden');
      return;
    }

    const final = resolveMOCAFinalScore(raw, schoolingYears);
    finalScoreLabel.textContent = String(final);
    interpretLabel.textContent  = interpretMOCA(final);
  }

  scoreInput.addEventListener('input', updateLiveScores);

  // Recalculate if user pre-filled score before schooling loaded
  if (scoreInput.value !== '') updateLiveScores();

  // ── Save ──────────────────────────────────────────────────────────────────
  document.getElementById('btnSaveMOCA').addEventListener('click', async () => {
    apiError.classList.add('hidden');
    scoreError.classList.add('hidden');

    const score = Number(scoreInput.value);
    const notes = notesInput.value.trim() || null;

    if (!scoreInput.value || isNaN(score) || score < 0 || score > 30) {
      scoreError.textContent = 'Ingresa un puntaje válido entre 0 y 30';
      scoreError.classList.remove('hidden');
      return;
    }

    try {
      const res = await fetch(config.endpoint(idUser, idApplication), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, notes }),
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

    } catch (err) {
      apiError.textContent = 'No se pudo conectar con el servidor';
      apiError.classList.remove('hidden');
      // eslint-disable-next-line no-console
      console.error('[MOCA] post error:', err);
    }
  });
}
