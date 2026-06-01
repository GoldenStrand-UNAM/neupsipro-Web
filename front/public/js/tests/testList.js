/* global getVariant, TEST_REGISTRY, escapeHTML, removeSkeletons, showToast*/

(function () {

  const _variantIcons = {
    warning: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    neutral: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    success: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    complete: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />',
    fatal: '<path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />',
  };

  // ── Card builder ────────────────────────────────────────────────────────────

  function createTestCard (test, { idUser, idApplication, applicationStatus }) {
    const variant   = getVariant(test.status);
    // eslint-disable-next-line security/detect-object-injection
    const statusIcon = _variantIcons[variant] ?? _variantIcons.neutral;
    const dateFormatted = test.dateApplied
      ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Sin fecha';

    const isClickable = !!TEST_REGISTRY[test.idTest];
    const testJson    = escapeHTML(JSON.stringify(test));

    return `
      <div class="application-card application-card--${variant} ${isClickable ? 'cursor-pointer' : ''}"
          data-id-results="${escapeHTML(test.idResults)}"
          data-id-test="${escapeHTML(String(test.idTest))}"
          data-test='${testJson}'
          ${isClickable
    ? `onclick='openOptionsModal("${escapeHTML(idUser)}","${escapeHTML(idApplication)}",{test:JSON.parse(this.dataset.test),applicationStatus:"${escapeHTML(applicationStatus)}"})'`
    : ''}>

        <div class="application-card__badge application-card__badge--${variant}">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="1.5" stroke="currentColor" class="white-icon-mini">
            ${statusIcon}
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

  // ── Export PDF ────────────────────────────────────────────────────────────────

  // Marks every test card as "Entregado" after a successful export.
  function markAllDelivered () {
    const variants = ['neutral', 'warning', 'success', 'complete', 'fatal'];
    document.querySelectorAll('.application-card').forEach(card => {
      const badge = card.querySelector('.application-card__badge');
      if (!badge) return;
      const text = badge.querySelector('p');
      if (text) text.textContent = 'Entregado';
      variants.forEach(v => {
        badge.classList.remove(`application-card__badge--${v}`);
        card.classList.remove(`application-card--${v}`);
      });
      badge.classList.add('application-card__badge--complete');
      card.classList.add('application-card--complete');
    });
  }

  // Downloads the application report PDF and updates the UI to "Entregado".
  async function exportPdf (idUser, idApplication, button) {
    const btn = button;
    btn.disabled = true;
    btn.classList.add('opacity-60');
    try {
      const res = await fetch(`/users/${idUser}/applications/${idApplication}/export`);

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast(json.error || 'No se pudo exportar el PDF');
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition') || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : 'reporte.pdf';

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('PDF exportado con éxito');
      markAllDelivered();
    } catch (err) {
      showToast('No se pudo conectar con el servidor');
      // eslint-disable-next-line no-console
      console.error('[exportPdf] error:', err);
    } finally {
      btn.disabled = false;
      btn.classList.remove('opacity-60');
    }
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

      // Show the export button once the application is graded or delivered
      const exportBtn = document.getElementById('btnExportPdf');
      if (exportBtn && (applicationStatus === 'Calificada' || applicationStatus === 'Entregado')) {
        exportBtn.classList.remove('hidden');
        exportBtn.onclick = () => exportPdf(idUser, idApplication, exportBtn);
      }

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
