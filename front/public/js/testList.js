(function () {

  // ── Helpers ────────────────────────────────────────────────────────────────

  function escapeHTML (str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Map status label to CSS variant (mirrors logbook.js pattern)
  const _statusMap = {
    'Por comenzar': 'neutral',
    'En proceso': 'warning',
    'Calificada': 'warning',
    'Entregado': 'success',
    'Caducada': 'fatal',
  };

  function getVariant (status) {
    return _statusMap[status] || 'neutral';
  }

  // ── Card builder ────────────────────────────────────────────────────────────

function createTestCard(test, idUser, idApplication) {
  const variant = getVariant(test.status);
  const dateFormatted = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX')
    : 'Sin fecha';

  // Cards are buttons only when the test has id_test 1 (BANFE) — extend for others later
  const isClickable = test.idTest === 1;

  return `
    <div class="application-card application-card--${variant} ${isClickable ? 'cursor-pointer' : ''}"
         data-id-results="${escapeHTML(test.idResults)}"
         data-id-test="${escapeHTML(String(test.idTest))}"
         ${isClickable
           ? `onclick="openBANFEModal('${escapeHTML(idUser)}', '${escapeHTML(idApplication)}')"` 
           : ''}>

      <div class="application-card__badge application-card__badge--${variant}">
        <p>${escapeHTML(test.status) || 'N/A'}</p>
      </div>

      <div class="application-card__content">
        <svg class="application-card__icon" fill="none" stroke="currentColor"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                   a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3 class="application-card__title">${escapeHTML(test.testName)}</h3>
        <p class="application-card__date">Aplicada: ${dateFormatted}</p>
        ${test.score !== null
          ? `<p class="text-sm text-gray-600">Puntaje: ${escapeHTML(String(test.score))}</p>`
          : ''}
      </div>
    </div>
  `;
}

  // ── Render helpers ──────────────────────────────────────────────────────────

  function showError (message) {
    const el = document.getElementById('testListError');
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
  }

  function removeSkeletons () {
    document.querySelectorAll('.test-card-skeleton')
      .forEach(el => el.remove());
  }

  // ── Main fetch ──────────────────────────────────────────────────────────────

  async function loadTests (idUser, idApplication) {
    const container = document.getElementById('testListContainer');

    try {
      const res = await fetch(`/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas`);

      const json = await res.json();

      removeSkeletons();

      if (!res.ok) {
        showError(json.error || 'Error al cargar las pruebas');
        return;
      }

      if (!json.data || json.data.length === 0) {
        container.innerHTML = `
                    <p class="text-sm text-gray-400 col-span-3 text-center py-8">
                        No hay pruebas asignadas para esta sesión.
                    </p>
                `;
        return;
      }

      // Render one card per test result
      json.data.forEach(test => {
        container.insertAdjacentHTML('beforeend', createTestCard(test, idUser, idApplication));
      });

    } catch (err) {
      removeSkeletons();
      showError('No se pudo conectar con el servidor');
      console.error('[testList] fetch error:', err);
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const { idUser, idApplication } = window.__TEST_PAGE__;
    loadTests(idUser, idApplication);
  });

})();

// ================================
//
// BANFE interpretation 
//
// ================================

function interpretBANFE(score) {
  const n = Number(score);
  if (isNaN(n))      return '';
  if (n <= 69)       return 'Discapacidad';
  if (n <= 84)       return 'Limítrofe';
  if (n <= 115)      return 'Promedio';
  return 'Promedio alto';
}

// ── BANFE modal builder ─────────────────────────────────────────────────────

function openBANFEModal(idUser, idApplication) {
  // Remove any existing modal before injecting a new one
  const existing = document.getElementById('modalBANFE');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id        = 'modalBANFE';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">

      <!-- Header -->
      <div class="modal__header">
        <h2 class="modal__title">BANFE</h2>
        <button id="btnCloseBANFE" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal__body flex flex-col gap-6">

        <!-- Score input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">
            Puntaje <span class="text-red-500">*</span>
          </label>
          <input
            id="inputBANFEScore"
            type="number"
            min="0"
            max="200"
            placeholder="0 – 200"
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition"
          />
          <p class="text-xs text-gray-400">Número entero entre 0 y 200</p>
          <p id="banfeScoreError" class="text-xs text-red-500 hidden"></p>
        </div>

        <!-- Live interpretation -->
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium text-gray-700">Interpretación</span>
          <span id="banfeInterpretation"
                class="text-lg font-semibold text-[#3350A9] min-h-7">
            —
          </span>
        </div>

        <!-- Notes input -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium text-gray-700">Notas</label>
          <textarea
            id="inputBANFENotes"
            rows="4"
            placeholder="Observaciones opcionales..."
            class="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-[#3350A9]
                   focus:border-transparent transition resize-none"
          ></textarea>
        </div>

        <!-- API error -->
        <p id="banfeApiError" class="text-xs text-red-500 hidden"></p>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <button id="btnCancelBANFE"
            class="flex items-center gap-2 px-5 py-2 rounded-lg border
                   border-gray-300 text-gray-700 text-sm hover:bg-gray-50
                   transition cursor-pointer">
            Cancelar
          </button>
          <button id="btnSaveBANFE"
            class="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#3350A9]
                   text-white text-sm hover:bg-[#2a4190] transition cursor-pointer">
            Guardar
          </button>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

}