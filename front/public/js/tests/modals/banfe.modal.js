/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast */

function interpretBANFE (score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n <= 69)   return 'Discapacidad';
  if (n <= 84)   return 'Limítrofe';
  if (n <= 115)  return 'Promedio';
  return 'Promedio alto';
}

// eslint-disable-next-line no-unused-vars
function openBANFEModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalBANFE');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  // Pre-fill values when modifying or consulting
  const prefillScore = (isModify || isConsult) ? (test.score ?? '') : '';
  const prefillNotes = (isModify || isConsult) ? (test.notes ?? '') : '';
  const prefillInterp = prefillScore !== '' ? interpretBANFE(prefillScore) : '—';

  const titles = { register: 'Registrar', modify: 'Modificar', consult: 'Consultar' };

  const modal = document.createElement('div');
  modal.id        = 'modalBANFE';
  modal.className = 'modal-overlay';
  modal.innerHTML =   isConsult ? `
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

        <!-- Row: Fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6
                    py-5
                    border-b border-gray-200
                    items-start">

          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">
            Fecha:
          </span>

          <span class="text-base sm:text-lg text-gray-900">
            ${test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : '—'}
          </span>

        </div>

        <!-- Row: Puntaje -->
        <div class="flex flex-col sm:flex-row
                    sm:items-start
                    gap-2 sm:gap-6
                    py-5
                    border-b border-gray-200">

          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">
            Puntaje:
          </span>

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

          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">
            Interpretación:
          </span>

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

          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">
            Notas:
          </span>

          <span class="text-base sm:text-lg
                      text-gray-900
                      leading-relaxed
                      break-words">
            ${prefillNotes ? escapeHTML(prefillNotes) : '—'}
          </span>

        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelBANFE"
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

    `
    <div class="modal">

      <div class="modal__header">
        <h2 class="modal__title">BANFE — ${titles[mode]}</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-6">

        <div class="flex flex-col md:flex-row gap-4">

        <!-- Score -->
        <div class="flex-1 flex flex-col gap-1 min-w-0">

          <label class="text-2xl font-regular">
            Puntaje ${!isConsult ? '<span class="text-red-500">*</span>' : ''}
          </label>

          <input
            id="inputBANFEScore"
            type="number"
            min="0"
            max="200"
            placeholder="0 – 200"
            value="${escapeHTML(String(prefillScore))}"
            ${isConsult ? 'disabled' : ''}
            class="w-full h-[52px]
                   border border-gray-300
                   rounded-lg
                   px-4
                   text-sm
                   focus:outline-none
                   focus:ring-2
                   focus:ring-[#3350A9]
                   focus:border-transparent
                   transition
                   ${isConsult ? 'bg-gray-50 cursor-default' : ''}"/>

          <p class="text-xs text-gray-400">
            Número entero entre 0 y 200
          </p>

          <p
            id="banfeScoreError"
            class="text-xs text-red-500 hidden">
          </p>
        </div>

        <!-- Interpretation -->
        <div class="flex-1 flex flex-col gap-1 min-w-0">

          <label class="text-2xl font-regular">
            Interpretación
          </label>

          <div
            class="w-full h-[52px]
                   flex items-center
                   border border-gray-300
                   rounded-lg
                   px-4
                   bg-gray-50">

            <span
              id="banfeInterpretation"
              class="text-sm text-gray-800 truncate">

              ${escapeHTML(prefillInterp)}

            </span>
          </div>
        </div>
      </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-2xl font-regular">Notas</label>
          <textarea
            id="inputBANFENotes"
            rows="4"
            maxlength="200"
            placeholder="Observaciones "
            ${isConsult ? 'disabled' : ''}
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none
                   ${isConsult ? 'bg-gray-50 cursor-default' : ''}"
          >${escapeHTML(prefillNotes)}</textarea>
          <p id="banfeNotesCount" class="text-lg text-gray-400 text-right">0 / 200</p>

        </div>

        <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          
          <button
            id="btnCancelBANFE"
            class="flex-1 flex items-center justify-center gap-3
                  px-4 py-3
                  border border-gray-300
                  rounded-2xl
                  font-regular
                  hover:bg-gray-50
                  transition-colors
                  cursor-pointer">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8">

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <span class="whitespace-nowrap">
              ${isConsult ? 'Cerrar' : 'Cancelar'}
            </span>

          </button>

          ${!isConsult ? `
          <button
            id="btnSaveBANFE"
            class="flex-1 flex items-center justify-center gap-3
                  px-4 py-3
                  rounded-2xl
                  bg-[#3350A9]
                  text-white
                  font-regular
                  hover:bg-[#2a4190]
                  transition-colors
                  cursor-pointer">

            <!-- Save -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-8 h-8">

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"/>

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 21v-8H7v8"/>

              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 3v5h8"/>
            </svg>

            <span class="whitespace-nowrap">
              Guardar
            </span>

          </button>
          ` : ''}
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const scoreInput     = document.getElementById('inputBANFEScore');

  const notesInput     = document.getElementById('inputBANFENotes');
  const notesCount     = document.getElementById('banfeNotesCount');
  const interpretLabel = document.getElementById('banfeInterpretation');
  const scoreError     = document.getElementById('banfeScoreError');
  const apiError       = document.getElementById('banfeApiError');

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseBANFE').addEventListener('click', closeModal);
  document.getElementById('btnCancelBANFE').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  notesInput.addEventListener('input', () => {
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 200`;

    // Turn red when at the limit
    notesCount.classList.toggle('text-red-500', len >= 200);
    notesCount.classList.toggle('text-gray-400', len < 200);
  });

  // Live interpretation — only in register/modify modes
  if (!isConsult) {
    scoreInput.addEventListener('input', () => {
      scoreError.classList.add('hidden');

      // Strip non-digit characters
      if (!/^\d*$/.test(scoreInput.value)) {
        scoreInput.value = scoreInput.value.replace(/\D/g, '');
      }

      const n = Number(scoreInput.value);

      if (scoreInput.value === '' || isNaN(n)) {
        interpretLabel.textContent = '—';
        return;
      }

      if (n > 200) {
        interpretLabel.textContent = '—';
        scoreError.textContent = 'El puntaje debe estar entre 0 y 200';
        scoreError.classList.remove('hidden');
        return;
      }

      interpretLabel.textContent = interpretBANFE(n);
    });

    // Save
    document.getElementById('btnSaveBANFE').addEventListener('click', async () => {
      apiError.classList.add('hidden');
      scoreError.classList.add('hidden');

      const score = Number(scoreInput.value);
      const notes = document.getElementById('inputBANFENotes').value.trim() || null;

      if (!scoreInput.value || isNaN(score) || score < 0 || score > 200) {
        scoreError.textContent = 'Ingresa un puntaje válido entre 0 y 200';
        scoreError.classList.remove('hidden');
        return;
      }

      const config = TEST_REGISTRY[1];

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

      } catch (_err) {
        apiError.textContent = 'No se pudo conectar con el servidor';
        apiError.classList.remove('hidden');
        // eslint-disable-next-line no-console
        console.error('[BANFE] post error:', _err);
      }
    });
  }
}
