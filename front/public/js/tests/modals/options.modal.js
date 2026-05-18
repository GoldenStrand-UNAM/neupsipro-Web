/* global escapeHTML, TEST_REGISTRY */

// eslint-disable-next-line no-unused-vars
function openOptionsModal (idUser, idApplication, test, applicationStatus) {
  const existing = document.getElementById('modalOptions');
  if (existing) existing.remove();

  const isExpired  = applicationStatus === 'Caducada';
  const hasScore   = test.status === 'Calificada';

  // Registrar — disabled if already graded or application is expired
  const canRegister = !hasScore && !isExpired;

  // Modificar — disabled if not graded or application is expired
  const canModify   = hasScore && !isExpired;

  // Consultar — available if graded, or always when application is expired
  const canConsult  = hasScore || isExpired;

  const modal = document.createElement('div');
  modal.id        = 'modalOptions';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">

      <div class="modal__header">
        <h2 class="modal__title">${escapeHTML(test.testName)}</h2>
        <button id="btnCloseOptions" class="modal__close" aria-label="Cerrar modal">
          <svg class="modal__close-icon" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal__body flex flex-col gap-4">

        <!-- Registrar -->
        <button id="btnGoRegister"
          class="w-full flex items-center gap-4 px-6 py-5 rounded-2xl border
                 border-gray-200 transition text-left
                 ${canRegister
                   ? 'hover:border-[#3350A9] hover:bg-[#3350A9]/5 cursor-pointer'
                   : 'opacity-40 cursor-not-allowed'}"
          ${canRegister ? '' : 'disabled'}>
          <svg class="w-6 h-6 text-[#000000] shrink-0" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-gray-900">Registrar resultados</p>
            <p class="text-xs text-gray-400">
              ${isExpired
                ? 'No disponible — aplicación caducada'
                : hasScore
                  ? 'Ya registrado — usa Modificar para editar'
                  : 'Ingresar puntaje e interpretación por primera vez'}
            </p>
          </div>
        </button>

        <!-- Modificar -->
        <button id="btnGoModify"
          class="w-full flex items-center gap-4 px-6 py-5 rounded-2xl border
                 border-gray-200 transition text-left
                 ${canModify
                   ? 'hover:border-[#3350A9] hover:bg-[#3350A9]/5 cursor-pointer'
                   : 'opacity-40 cursor-not-allowed'}"
          ${canModify ? '' : 'disabled'}>
          <svg class="w-6 h-6 text-[#000000] shrink-0" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582
                     16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1
                     1.13-1.897l8.932-8.931Z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-gray-900">Modificar resultados</p>
            <p class="text-xs text-gray-400">
              ${isExpired
                ? 'No disponible — aplicación caducada'
                : canModify
                  ? 'Editar puntaje y notas existentes'
                  : 'Disponible después de registrar'}
            </p>
          </div>
        </button>

        <!-- Consultar -->
        <button id="btnGoConsult"
          class="w-full flex items-center gap-4 px-6 py-5 rounded-2xl border
                 border-gray-200 transition text-left
                 ${canConsult
                   ? 'hover:border-[#3350A9] hover:bg-[#3350A9]/5 cursor-pointer'
                   : 'opacity-40 cursor-not-allowed'}"
          ${canConsult ? '' : 'disabled'}>
          <svg class="w-6 h-6 text-[#000000] shrink-0" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12
                     4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577
                     16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-gray-900">Consultar resultados</p>
            <p class="text-xs text-gray-400">
              ${canConsult
                ? 'Ver puntaje, interpretación y notas'
                : 'Disponible después de registrar'}
            </p>
          </div>
        </button>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  function closeModal () { modal.remove(); }

  document.getElementById('btnCloseOptions').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const config = TEST_REGISTRY[test.idTest];
  if (!config) return;

  if (canRegister) {
    document.getElementById('btnGoRegister').addEventListener('click', () => {
      closeModal();
      config.openRegister(idUser, idApplication, test);
    });
  }

  if (canModify) {
    document.getElementById('btnGoModify').addEventListener('click', () => {
      closeModal();
      config.openModify(idUser, idApplication, test);
    });
  }

  if (canConsult) {
    document.getElementById('btnGoConsult').addEventListener('click', () => {
      closeModal();
      config.openConsult(idUser, idApplication, test);
    });
  }
}