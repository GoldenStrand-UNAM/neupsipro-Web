(function () {

    // ── Helpers ────────────────────────────────────────────────────────────────

    function escapeHTML(str) {
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
        'En proceso':   'warning',
        'Calificada':   'warning',
        'Entregado':    'success',
        "Caducada": "fatal",
    };

    function getVariant(status) {
        return _statusMap[status] || 'neutral';
    }

    // ── Card builder ────────────────────────────────────────────────────────────

    function createTestCard(test) {
        const variant = getVariant(test.status);

        const dateFormatted = test.dateApplied
            ? new Date(test.dateApplied).toLocaleDateString('es-MX')
            : 'Sin fecha';

        return `
            <div class="application-card application-card--${variant}">

                <!-- Status badge -->
                <div class="application-card__badge application-card__badge--${variant}">
                    <p>${escapeHTML(test.status) || 'N/A'}</p>
                </div>

                <div class="application-card__content">

                    <!-- Test icon -->
                    <svg class="application-card__icon" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                                 a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>

                    <!-- Test name -->
                    <h3 class="application-card__title">
                        ${escapeHTML(test.testName)}
                    </h3>

                    <!-- Date applied if available -->
                    <p class="application-card__date">
                        Aplicada: ${dateFormatted}
                    </p>

                    <!-- Score if available -->
                    ${test.score !== null
                        ? `<p class="text-sm text-gray-600">Puntaje: ${escapeHTML(String(test.score))}</p>`
                        : ''}

                </div>
            </div>
        `;
    }

    // ── Render helpers ──────────────────────────────────────────────────────────

    function showError(message) {
        const el = document.getElementById('testListError');
        if (!el) return;
        el.textContent = message;
        el.classList.remove('hidden');
    }

    function removeSkeletons() {
        document.querySelectorAll('.test-card-skeleton')
            .forEach(el => el.remove());
    }

    // ── Main fetch ──────────────────────────────────────────────────────────────

    async function loadTests(idUser, idApplication) {
        const container = document.getElementById('testListContainer');

        try {
            const res = await fetch(
                `/api/usuarios/${idUser}/aplicaciones/${idApplication}/pruebas`
            );

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
                container.insertAdjacentHTML('beforeend', createTestCard(test));
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