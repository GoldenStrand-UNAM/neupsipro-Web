const REY_TABLE = {
  '>12': {
    '18-22': { 60: 36.0, 50: 34.9, 40: 33.4, 30: 31.8, 20: 29.9, 15: 28.7, 10: 27.2, 5: 25.1 },
    '23-27': { 60: 36.0, 50: 34.5, 40: 33.0, 30: 31.4, 20: 29.5, 15: 28.3, 10: 26.8, 5: 24.7 },
    '28-32': { 70: 36.0, 60: 35.6, 50: 34.1, 40: 32.6, 30: 31.0, 20: 29.1, 15: 27.9, 10: 26.4, 5: 24.3 },
    '33-37': { 70: 36.0, 60: 35.2, 50: 33.7, 40: 32.2, 30: 30.6, 20: 28.7, 15: 27.5, 10: 26.0, 5: 23.9 },
    '38-42': { 70: 36.0, 60: 34.8, 50: 33.3, 40: 31.8, 30: 30.2, 20: 28.3, 15: 27.1, 10: 25.6, 5: 23.5 },
    '43-47': { 70: 36.0, 60: 34.4, 50: 32.9, 40: 31.4, 30: 29.8, 20: 27.8, 15: 26.6, 10: 25.2, 5: 23.1 },
    '48-52': { 80: 36.0, 70: 35.6, 60: 34.0, 50: 32.5, 40: 31.0, 30: 29.4, 20: 27.4, 15: 26.2, 10: 24.8, 5: 22.6 },
    '53-57': { 80: 36.0, 70: 35.2, 60: 33.6, 50: 32.1, 40: 30.6, 30: 29.0, 20: 27.0, 15: 25.8, 10: 24.4, 5: 22.2 },
    '58-62': { 80: 36.0, 70: 34.8, 60: 33.2, 50: 31.7, 40: 30.2, 30: 28.6, 20: 26.6, 15: 25.4, 10: 24.0, 5: 21.8 },
    '63-67': { 80: 36.0, 70: 34.4, 60: 32.8, 50: 31.3, 40: 29.8, 30: 28.1, 20: 26.2, 15: 25.0, 10: 23.6, 5: 21.4 },
    '68-72': { 85: 36.0, 80: 35.9, 70: 34.0, 60: 32.4, 50: 30.9, 40: 29.4, 30: 27.7, 20: 25.8, 15: 24.6, 10: 23.2, 5: 21.0 },
    '73-77': { 85: 36.0, 80: 35.5, 70: 33.6, 60: 32.0, 50: 30.5, 40: 29.0, 30: 27.3, 20: 25.4, 15: 24.2, 10: 22.8, 5: 20.6 },
    '>77': { 85: 36.0, 80: 35.1, 70: 33.2, 60: 31.5, 50: 30.0, 40: 28.6, 30: 26.9, 20: 25.0, 15: 23.8, 10: 22.4, 5: 20.2 },
  },
  '1-12': {
    '18-22': { 80: 36.0, 70: 35.8, 60: 34.2, 50: 32.7, 40: 31.2, 30: 29.6, 20: 27.7, 15: 26.5, 10: 25.0, 5: 22.9 },
    '23-27': { 80: 36.0, 70: 35.4, 60: 33.8, 50: 32.3, 40: 30.8, 30: 29.2, 20: 27.3, 15: 26.1, 10: 24.6, 5: 22.5 },
    '28-32': { 80: 36.0, 70: 35.0, 60: 33.4, 50: 31.9, 40: 30.4, 30: 28.8, 20: 26.9, 15: 25.7, 10: 24.2, 5: 22.1 },
    '33-37': { 80: 36.0, 70: 34.6, 60: 33.0, 50: 31.5, 40: 30.0, 30: 28.4, 20: 26.5, 15: 25.3, 10: 23.8, 5: 21.7 },
    '38-42': { 80: 36.0, 70: 34.2, 60: 32.6, 50: 31.1, 40: 29.6, 30: 28.0, 20: 26.1, 15: 24.9, 10: 23.4, 5: 21.3 },
    '43-47': { 85: 36.0, 80: 35.7, 70: 33.8, 60: 32.2, 50: 30.7, 40: 29.2, 30: 27.6, 20: 25.7, 15: 24.5, 10: 23.0, 5: 20.9 },
    '48-52': { 85: 36.0, 80: 35.3, 70: 33.4, 60: 31.8, 50: 30.3, 40: 28.8, 30: 27.2, 20: 25.2, 15: 24.1, 10: 22.6, 5: 20.5 },
    '53-57': { 85: 36.0, 80: 34.9, 70: 33.0, 60: 31.4, 50: 29.9, 40: 28.4, 30: 26.8, 20: 24.8, 15: 23.6, 10: 22.2, 5: 20.0 },
    '58-62': { 90: 36.0, 85: 35.7, 80: 34.5, 70: 32.6, 60: 31.0, 50: 29.5, 40: 28.0, 30: 26.4, 20: 24.4, 15: 23.2, 10: 21.8, 5: 19.6 },
    '63-67': { 90: 36.0, 85: 35.3, 80: 34.1, 70: 32.2, 60: 30.6, 50: 29.1, 40: 27.6, 30: 26.0, 20: 24.0, 15: 22.8, 10: 21.4, 5: 19.2 },
    '68-72': { 90: 36.0, 85: 34.9, 80: 33.7, 70: 31.8, 60: 30.2, 50: 28.7, 40: 27.2, 30: 25.5, 20: 23.6, 15: 22.4, 10: 21.0, 5: 18.8 },
    '73-77': { 95: 36.0, 90: 35.9, 85: 34.5, 80: 33.3, 70: 31.4, 60: 29.8, 50: 28.3, 40: 26.8, 30: 25.1, 20: 23.2, 15: 22.0, 10: 20.6, 5: 18.4 },
    '>77': { 95: 36.0, 90: 35.5, 85: 34.1, 80: 32.9, 70: 31.0, 60: 29.4, 50: 27.9, 40: 26.4, 30: 24.7, 20: 22.8, 15: 21.6, 10: 20.2, 5: 18.0 },
  },
};

function resolveAgeRange (age) {
  if (age >= 18 && age <= 22) return '18-22';
  if (age >= 23 && age <= 27) return '23-27';
  if (age >= 28 && age <= 32) return '28-32';
  if (age >= 33 && age <= 37) return '33-37';
  if (age >= 38 && age <= 42) return '38-42';
  if (age >= 43 && age <= 47) return '43-47';
  if (age >= 48 && age <= 52) return '48-52';
  if (age >= 53 && age <= 57) return '53-57';
  if (age >= 58 && age <= 62) return '58-62';
  if (age >= 63 && age <= 67) return '63-67';
  if (age >= 68 && age <= 72) return '68-72';
  if (age >= 73 && age <= 77) return '73-77';
  if (age > 77) return '>77';
  return null;
}

function resolveEducationBlock (schoolingYears) {
  if (schoolingYears === null) return null;
  return schoolingYears > 12 ? '>12' : '1-12';
}

function resolveSchoolingYears (schooling) {
  const map = {
    'Sin escolaridad': 0, 'Primaria': 6, 'Secundaria': 9,
    'Bachillerato': 12,   'Licenciatura': 16, 'Posgrado': 18,
  };
  return map[schooling] ?? null;
}

function resolveNormativeScore (percentile, educationBlock, ageRange) {
  // Get the matrix column using education block and age range
  const column = REY_TABLE[educationBlock]?.[ageRange];

  // Return null if the column does not exist
  if (!column) return null;

  // Convert percentile keys to numbers
  const percentiles = Object.keys(column).map(Number);

  // Initialize with the first percentile available
  let closest = percentiles[0];
  let minDiff = Math.abs(percentile - closest);

  // Find the closest percentile in the matrix
  for (const p of percentiles) {
    const diff = Math.abs(percentile - p);

    // Replace current closest percentile if this one is nearer
    if (diff < minDiff) {
      closest = p;
      minDiff = diff;
    }

    // If there is a tie, use the lower percentile
    // to maintain conservative clinical interpretation
    else if (diff === minDiff && p < closest) {
      closest = p;
    }
  }

  // Return the exact normative score stored in the matrix
  return column[closest];
}

async function openREYModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalREY');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  const prefillScore = (isModify || isConsult) ? (test.score ?? '') : '';
  const prefillNotes = (isModify || isConsult) ? (test.notes ?? '') : '';

  const titles = { register: 'Registrar', modify: 'Modificar', consult: 'Consultar' };

  const modal = document.createElement('div');
  modal.id        = 'modalREY';
  modal.className = 'modal-overlay';

  // ── Consult mode ──────────────────────────────────────────────────────────
  modal.innerHTML = isConsult ? `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">REY</h2>
        <button id="btnCloseREY" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="modal__body flex flex-col">

        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-2 sm:gap-x-6
                    py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Fecha:</span>
          <span class="text-base sm:text-lg text-gray-900">
            ${test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—'}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-2 sm:gap-x-6
                    py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Percentil:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${test.score !== null ? escapeHTML(String(test.score)) : '—'}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-2 sm:gap-x-6
                    py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Puntaje normativo:</span>
          <span class="text-base sm:text-lg text-gray-900 font-medium">
            ${escapeHTML(test.interpretation ?? '—')}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-y-2 sm:gap-x-6
                    py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-words">
            ${prefillNotes ? escapeHTML(prefillNotes) : '—'}
          </span>
        </div>

        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelREY"
            class="flex items-center gap-3 px-6 py-3 border border-gray-300
                   rounded-2xl text-base hover:bg-gray-50 transition-colors cursor-pointer">
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
        <h2 class="modal__title">REY — ${titles[mode]}</h2>
        <button id="btnCloseREY" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-6">

        <!-- Info banner: schooling + age -->
        <div id="REYInfoBanner"
             class="flex items-center gap-3 px-4 py-3 bg-gray-50
                    border border-gray-200 rounded-xl text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor"
               class="w-5 h-5 shrink-0 text-[#3350A9]">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75
                     0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/>
          </svg>
          <span id="REYInfoText">Cargando datos del paciente...</span>
        </div>

        <!-- Percentile input + normative score -->
        <div class="flex flex-col md:flex-row gap-4">

          <div class="flex-1 flex flex-col gap-1 min-w-0">
            <label class="text-2xl font-regular">
              Percentil <span class="text-red-500">*</span>
            </label>
            <input
              id="inputREYScore"
              type="number"
              min="0"
              max="95"
              placeholder="0 – 95"
              value="${escapeHTML(String(prefillScore))}"
              class="w-full h-[52px] border border-gray-300 rounded-lg px-4
                     text-sm focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition"/>
            <p class="text-xs text-gray-400">Número entero entre 0 y 95</p>
            <p id="REYScoreError" class="text-xs text-red-500 hidden"></p>
          </div>

          <div class="flex-1 flex flex-col gap-1 min-w-0">
            <label class="text-2xl font-regular">Puntaje normativo</label>
            <div class="w-full h-[52px] flex items-center border border-gray-300
                        rounded-lg px-4 bg-gray-50">
              <span id="REYNormativeScore" class="text-sm text-gray-800">—</span>
            </div>
            <p class="text-xs text-gray-400">Calculado de la tabla normativa</p>
          </div>

        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea
            id="inputREYNotes"
            rows="4"
            maxlength="200"
            placeholder="Observaciones"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          >${escapeHTML(prefillNotes)}</textarea>
          <p id="REYNotesCount" class="text-lg text-gray-400 text-right">
            ${String(prefillNotes).length} / 200
          </p>
        </div>

        <p id="REYApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button id="btnCancelREY"
            class="flex-1 flex items-center justify-center gap-3 px-4 py-3
                   border border-gray-300 rounded-2xl font-regular
                   hover:bg-gray-50 transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            <span class="whitespace-nowrap">Cancelar</span>
          </button>

          <button id="btnSaveREY"
            class="flex-1 flex items-center justify-center gap-3 px-4 py-3
                   rounded-2xl bg-[#3350A9] text-white font-regular
                   hover:bg-[#2a4190] transition-colors cursor-pointer">
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

  const scoreInput      = document.getElementById('inputREYScore');
  const normativeLabel  = document.getElementById('REYNormativeScore');
  const scoreError      = document.getElementById('REYScoreError');
  const apiError        = document.getElementById('REYApiError');
  const notesInput      = document.getElementById('inputREYNotes');
  const notesCount      = document.getElementById('REYNotesCount');
  const infoText        = document.getElementById('REYInfoText');

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseREY').addEventListener('click', closeModal);
  document.getElementById('btnCancelREY').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  if (isConsult) return;

  // ── Fetch schooling + age in parallel ────────────────────────────────────
  const config = TEST_REGISTRY[3];

  let educationBlock = null;
  let ageRange       = null;

  try {
    const [sRes, aRes] = await Promise.all([
      fetch(config.schoolingEndpoint(idUser)),
      fetch(config.ageEndpoint(idUser)),
    ]);

    const sJson = await sRes.json();
    const aJson = await aRes.json();

    const schoolingYears = resolveSchoolingYears(sJson.schooling);
    educationBlock       = resolveEducationBlock(schoolingYears);
    ageRange             = resolveAgeRange(aJson.age);

    const schoolingLabel = sJson.schooling ?? 'Sin datos';
    const ageLabel       = aJson.age !== null ? `${aJson.age} años` : 'Sin datos';
    const blockLabel     = educationBlock === '>12' ? 'Más de 12 años' : '1 a 12 años';

    infoText.textContent =
      `Escolaridad: ${schoolingLabel} (${blockLabel}) · Edad: ${ageLabel} · Rango: ${ageRange ?? 'fuera de tabla'}`;

  } catch {
    infoText.textContent = 'No se pudieron cargar los datos del paciente';
  }

  // ── Live normative score ──────────────────────────────────────────────────
  function updateLiveScore () {
    scoreError.classList.add('hidden');

    if (!/^\d*$/.test(scoreInput.value)) {
      scoreInput.value = scoreInput.value.replace(/\D/g, '');
    }

    const percentile = Number(scoreInput.value);

    if (scoreInput.value === '' || isNaN(percentile)) {
      normativeLabel.textContent = '—';
      return;
    }

    if (percentile > 95) {
      normativeLabel.textContent = '—';
      scoreError.textContent = 'El percentil debe estar entre 0 y 95';
      scoreError.classList.remove('hidden');
      return;
    }

    if (!educationBlock || !ageRange) {
      normativeLabel.textContent = 'Sin datos suficientes';
      return;
    }

    const normative = resolveNormativeScore(percentile, educationBlock, ageRange);
    normativeLabel.textContent = normative !== null ? String(normative) : '—';
  }

  scoreInput.addEventListener('input', updateLiveScore);
  if (scoreInput.value !== '') updateLiveScore();

  // ── Notes counter ─────────────────────────────────────────────────────────
  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });

  // ── Save ──────────────────────────────────────────────────────────────────
  document.getElementById('btnSaveREY').addEventListener('click', async () => {
    apiError.classList.add('hidden');
    scoreError.classList.add('hidden');

    const score = Number(scoreInput.value);
    const notes = notesInput.value.trim() || null;

    if (!scoreInput.value || isNaN(score) || score < 0 || score > 95) {
      scoreError.textContent = 'Ingresa un percentil válido entre 0 y 95';
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
      console.error('[REY] post error:', err);
    }
  });
}
