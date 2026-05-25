/* global getVariant, TEST_REGISTRY, escapeHTML, removeSkeletons, showToast*/

(function () {

  const _variantIcons = {
    warning:  '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    neutral:  '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    success:  '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    complete: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    fatal:    '<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />',
  };

  // ── Card builder ────────────────────────────────────────────────────────────

  function createTestCard (test, { idUser, idApplication, applicationStatus }) {
    const variant       = getVariant(test.status);
    const dateFormatted = test.dateApplied
      ? new Date(test.dateApplied).toLocaleDateString('es-MX')
      : 'Sin fecha';

    const isClickable = !!TEST_REGISTRY[test.idTest];
    const testJson    = escapeHTML(JSON.stringify(test));

    return `
      <div class="application-card application-card--${variant} ${isClickable ? 'cursor-pointer' : ''}"
          data-id-results="${escapeHTML(test.idResults)}"
          data-id-test="${escapeHTML(String(test.idTest))}"
          ${isClickable
    ? `onclick='openOptionsModal("${escapeHTML(idUser)}","${escapeHTML(idApplication)}",{test:${testJson},applicationStatus:"${escapeHTML(applicationStatus)}"})'`
    : ''}>

        <div class="application-card__badge application-card__badge--${variant}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="white-icon-mini">
            ${_variantIcons[variant] ?? _variantIcons.neutral}
          </svg>
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
        </div>
      </div>
    `;
  }

  // ── Main fetch ──────────────────────────────────────────────────────────────

  async function loadTests (idUser, idApplication) {
    const container = document.getElementById('testListContainer');

    try {
      const res  = await fetch(`/api/users/${idUser}/applications/${idApplication}/tests`);
      const json = await res.json();

      removeSkeletons();

      if (!res.ok) {
        showToast(json.error || 'Error al cargar las pruebas');
        return;
      }

      const { applicationStatus, tests } = json.data;

      // Show expiry banner if application is Caducada
      if (applicationStatus === 'Caducada') {
        document.getElementById('expiryBanner').classList.remove('hidden');
      }

      if (!tests || tests.length === 0) {
        container.innerHTML = `
          <p class="text-sm text-gray-400 col-span-3 text-center py-8">
            No hay pruebas asignadas para esta aplicación.
          </p>`;
        return;
      }

      // Render one card per test result
      tests.forEach(test => {
        container.insertAdjacentHTML(
          'beforeend',
          createTestCard(test, { idUser, idApplication, applicationStatus })
        );
      });

    } catch (err) {
      removeSkeletons();
      showToast('No se pudo conectar con el servidor');
      // eslint-disable-next-line no-console
      console.error('[testList] fetch error:', err);
    }
  }

  // ── Init ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const { idUser, idApplication } = window.__TEST_PAGE__;
    loadTests(idUser, idApplication);
  });

})();
