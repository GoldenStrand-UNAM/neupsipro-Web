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
    const variant    = getVariant(test.status);
    const statusIcon = _variantIcons[variant] ?? _variantIcons.neutral;
    const dateFormatted = test.dateApplied
      ? new Date(test.dateApplied).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
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
          <p class="application-card__date">Registrada: ${dateFormatted}</p>
        </div>
      </div>
    `;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function _enableExportBtn (idUser, idApplication) {
    const btn = document.getElementById('btnExportPdf');
    if (!btn) return;
    btn.disabled = false;
    btn.classList.remove('bg-gray-400', 'opacity-50', 'cursor-not-allowed');
    btn.classList.add('bg-[#BA8700]', 'cursor-pointer');
    btn.onclick = () => exportPdf(idUser, idApplication, btn);
  }

  function _disableExportBtn () {
    const btn = document.getElementById('btnExportPdf');
    if (!btn) return;
    btn.disabled = true;
    btn.classList.remove('bg-[#BA8700]', 'cursor-pointer');
    btn.classList.add('bg-gray-400', 'opacity-50', 'cursor-not-allowed');
    btn.onclick = null;
  }

  // ── Export PDF ───────────────────────────────────────────────────────────────

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

  async function exportPdf (idUser, idApplication, button) {
    const btn     = button;
    const iconEl  = document.getElementById('exportPdfIcon');
    const labelEl = btn.querySelector('span');

    btn.disabled = true;
    if (iconEl) iconEl.innerHTML = `<svg class="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" class="stroke-current opacity-25" stroke-width="3"/>
      <path d="M12 2a10 10 0 0 1 10 10" class="stroke-current" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
    if (labelEl) labelEl.textContent = 'Cargando...';

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
      console.error('[exportPdf] error:', err);
    } finally {
      btn.disabled = false;
      if (iconEl) iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>`;
      if (labelEl) labelEl.textContent = 'Exportar PDF';
    }
  }

  // ── Reveal export (called by utils.js after every card update) ───────────────

  window._revealExportIfAllGraded = function () {
    const allCards = document.querySelectorAll('[data-id-results]');
    if (allCards.length === 0) return;

    const allGraded = [...allCards].every(card => {
      try {
        const data = JSON.parse(card.dataset.test || '{}');
        return data.status === 'Calificada' || data.status === 'Entregado';
      } catch { return false; }
    });

    if (!allGraded) return;

    const { idUser, idApplication } = window.__TEST_PAGE__ || {};
    _enableExportBtn(idUser, idApplication);
  };

  // ── Main fetch ───────────────────────────────────────────────────────────────

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

      tests.forEach(test => {
        container.insertAdjacentHTML(
          'beforeend',
          createTestCard(test, { idUser, idApplication, applicationStatus })
        );
      });

      // El botón siempre es visible — amarillo si listo, gris si no
      const isReady = applicationStatus === 'Calificada' || applicationStatus === 'Entregado';
      if (isReady) {
        _enableExportBtn(idUser, idApplication);
      } else {
        _disableExportBtn();
      }

    } catch (err) {
      removeSkeletons();
      showToast('No se pudo conectar con el servidor');
      console.error('[testList] fetch error:', err);
    }
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', () => {
    const { idUser, idApplication } = window.__TEST_PAGE__;
    loadTests(idUser, idApplication);
  });

})();