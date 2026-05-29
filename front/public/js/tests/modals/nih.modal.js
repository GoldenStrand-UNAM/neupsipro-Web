/* global escapeHTML, TEST_REGISTRY, updateTestCardStatus, showToast, _csrfToken */

// ── CONSULT MODAL ─────────────────────────────────────────────────────────────
// Read-only view of a graded NIH result.
// NIH has no score or interpretation — only date and notes.

function buildNIHConsultHTML (test) {
  const notes = test.notes ?? '';

  const dateLabel = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
    : '—';

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">NIH</h2>
        <button id="btnCloseNIH" class="modal__close" aria-label="Cerrar modal">
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

        <!-- Notas -->
        <div class="grid grid-cols-1 sm:grid-cols-[160px_1fr]
                    gap-y-2 sm:gap-x-6 py-5 border-b border-gray-200 items-start">
          <span class="sm:w-40 shrink-0 text-gray-400 text-lg sm:text-base">Notas:</span>
          <span class="text-base sm:text-lg text-gray-900 leading-relaxed break-all whitespace-pre-wrap">
          ${notes ? escapeHTML(notes) : '—'}
          </span>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4 border-t border-gray-200">
          <button id="btnCancelNIH"
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

// ── REGISTER AND MODIFY MODAL ────────────────────────────────────────────────────────────────
// Shared HTML for register and modify modes.
// NIH has no score or interpretation — only a notes textarea.

function buildNIHFormHTML (mode, prefill) {
  const title = mode === 'register' ? 'Registrar' : 'Modificar';

  return `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">NIH — ${title}</h2>
        <button id="btnCloseNIH" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-4">

        <!-- Notes — only field for NIH -->
        <div class="flex flex-col gap-1">
          <label class="text-sm font-medium text-gray-700">Notas</label>
          <div class="relative">
            <textarea
              id="inputNIHNotes"
              rows="6"
              maxlength="500"
              placeholder="Observaciones"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                     focus:border-transparent transition resize-none pb-5"
            >${escapeHTML(prefill.notes)}</textarea>
            <p id="nihNotesCount" class="absolute bottom-2 right-2 text-xs text-gray-500">
              ${prefill.notes.length} / 500
            </p>
          </div>
        </div>

        <p id="nihApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex gap-3">

          <button id="btnCancelNIH"
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

          <button id="btnSaveNIH" class="btn-save">
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

// ── Form Listeners ───────────────────────────────────────────────────────────
// Wires up notes counter, validation, and save fetch.

function bindNIHFormListeners (idUser, idApplication, closeModal) {

  const notesInput = document.getElementById('inputNIHNotes');
  const notesCount = document.getElementById('nihNotesCount');
  const apiError   = document.getElementById('nihApiError');

  // ── Notes counter ──────────────────────────────────────────────────────────

  notesInput.addEventListener('input', () => {
    notesInput.value = notesInput.value.replace(/\p{Extended_Pictographic}/gu, '');
    const len = notesInput.value.length;
    notesCount.textContent = `${len} / 500`;
  });

  // ── Save ───────────────────────────────────────────────────────────────────

  document.getElementById('btnSaveNIH').addEventListener('click', async () => {
    apiError.classList.add('hidden');

    const notes = notesInput.value.trim();
    if (!notes) {
      apiError.textContent = 'Las notas son requeridas';
      apiError.classList.remove('hidden');
      return;
    }
    const config = TEST_REGISTRY[5];

    try {
      const res = await fetch(config.endpoint(idUser, idApplication), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': _csrfToken },
        body: JSON.stringify({ notes }),
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
      console.error('[NIH] post error:', _err);
    }
  });
}

// ── CLOSE AND OPEN MODAL ──────────────────────────────────────────────────────────────
// Fetches existing result before opening modify/consult.
// Register mode skips fetch — prefill is empty.
// NIH has no score or interpretation — only notes.

// eslint-disable-next-line no-unused-vars
async function openNIHModal (idUser, idApplication, test, mode) {
  const existing = document.getElementById('modalNIH');
  if (existing) existing.remove();

  const isConsult = mode === 'consult';
  const isModify  = mode === 'modify';

  // ── Fetch existing result before opening modify/consult ──────────────────

  let fetchedTest = test;

  if (isModify || isConsult) {
    try {
      const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests/5/results/${test.idResults}`);
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
      console.error('[NIH] get error:', _err);
      return;
    }
  }

  // ── Build prefill from fetched data ──────────────────────────────────────

  const prefill = {
    notes: (isModify || isConsult) ? (fetchedTest.notes ?? '') : '',
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const modal = document.createElement('div');
  modal.id        = 'modalNIH';
  modal.className = 'modal-overlay';
  modal.innerHTML = isConsult
    ? buildNIHConsultHTML(fetchedTest)
    : buildNIHFormHTML(mode, prefill);

  document.body.appendChild(modal);

  // ── Shared close logic ────────────────────────────────────────────────────

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseNIH').addEventListener('click', closeModal);
  document.getElementById('btnCancelNIH').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  // ── Form listeners only on register / modify ──────────────────────────────

  if (!isConsult) {
    bindNIHFormListeners(idUser, idApplication, closeModal);
  }
}