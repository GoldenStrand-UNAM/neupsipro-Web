function interpretBANFE(score) {
  const n = Number(score);
  if (isNaN(n))  return '';
  if (n <= 69)   return 'Discapacidad';
  if (n <= 84)   return 'Limítrofe';
  if (n <= 115)  return 'Promedio';
  return 'Promedio alto';
}

function openBANFEModal(idUser, idApplication, test, mode) {
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
  modal.innerHTML = `
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

        <!-- Score -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">
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
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition
                   ${isConsult ? 'bg-gray-50 cursor-default' : ''}"/>
          <p class="text-xs text-gray-400">Número entero entre 0 y 200</p>
          <p id="banfeScoreError" class="text-xs text-red-500 hidden"></p>
        </div>

        <!-- Live interpretation -->
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Interpretación</span>
          <span id="banfeInterpretation" class="text-lg font-semibold text-black min-h-7">
            ${escapeHTML(prefillInterp)}
          </span>
        </div>

        <!-- Notes -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Notas</label>
          <textarea
            id="inputBANFENotes"
            rows="4"
            placeholder="Observaciones opcionales..."
            ${isConsult ? 'disabled' : ''}
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none
                   ${isConsult ? 'bg-gray-50 cursor-default' : ''}"
          >${escapeHTML(prefillNotes)}</textarea>
        </div>

        <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button id="btnCancelBANFE"
            class="flex items-center gap-2 px-5 py-2 rounded-lg border
                   border-gray-300 text-gray-700 text-sm hover:bg-gray-50
                   transition cursor-pointer">
            ${isConsult ? 'Cerrar' : 'Cancelar'}
          </button>
          ${!isConsult ? `
          <button id="btnSaveBANFE"
            class="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#3350A9]
                   text-white text-sm hover:bg-[#2a4190] transition cursor-pointer">
            Guardar
          </button>` : ''}
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const scoreInput     = document.getElementById('inputBANFEScore');
  const interpretLabel = document.getElementById('banfeInterpretation');
  const scoreError     = document.getElementById('banfeScoreError');
  const apiError       = document.getElementById('banfeApiError');

  function closeModal() { modal.remove(); }

  document.getElementById('btnCloseBANFE').addEventListener('click', closeModal);
  document.getElementById('btnCancelBANFE').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

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
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ score, notes }),
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
        console.error('[BANFE] post error:', err);
      }
    });
  }
}