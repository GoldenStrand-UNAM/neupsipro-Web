(function () {


  // ── Card builder ────────────────────────────────────────────────────────────

function createTestCard(test, idUser, idApplication) {
  const variant = getVariant(test.status);
  const dateFormatted = test.dateApplied
    ? new Date(test.dateApplied).toLocaleDateString('es-MX')
    : 'Sin fecha';

  // Cards are buttons only when the test has id_test 1 (BANFE) — extend for others later
  const isClickable = test.idTest === 1;

  const testJson = escapeHTML(JSON.stringify(test));

  return `
    <div class="application-card application-card--${variant} ${isClickable ? 'cursor-pointer' : ''}"
         data-id-results="${escapeHTML(test.idResults)}"
         data-id-test="${escapeHTML(String(test.idTest))}"
         ${isClickable
           ? `onclick='openOptionsModal("${escapeHTML(idUser)}","${escapeHTML(idApplication)}",${testJson})'` 
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






