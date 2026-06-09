/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */

// Get back info
window.sidebarState = window.sidebarState || {
  currentStep: 1,
  completedSteps: [],
};

// Render UI
function renderSidebar () {

  // Solo opera sobre el bloque de fase activo (visible) para evitar
  // pintar duplicados cuando varios bloques comparten data-step.
  const activeBlock = document.querySelector(
    '#sidebar-timeline > div:not(.hidden)'
  );
  if (!activeBlock) return;

  const steps = activeBlock.querySelectorAll('.subStep');
  // For each step update UI
  steps.forEach(stepEl => {

    const step = Number(stepEl.dataset.step);

    const circle = stepEl.querySelector('.circle');
    const title = stepEl.querySelector('.title');
    const status = stepEl.querySelector('.status');

    if (!circle || !title || !status) return;

    // Update UI
    circle.className =
      'circle w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-200 text-gray-500';

    title.className =
      'title text-sm font-medium text-gray-400';

    status.className =
      'status text-xs text-gray-500 mt-1';

    status.textContent = 'Pendiente';

    // Set as complete
    if (window.sidebarState.completedSteps.includes(step)) {
      circle.className =
        'circle w-6 h-6 rounded-full flex items-center justify-center text-xs bg-gray-300 text-black';

      status.textContent = 'Completado';
    }

    // Set as Active
    if (step === window.sidebarState.currentStep) {
      circle.className =
        'circle w-6 h-6 rounded-full flex items-center justify-center text-xs bg-[#BA8700] text-white font-bold';

      title.className =
        'title text-sm font-medium text-[#BA8700]';

      status.className =
        'status text-xs text-black mt-1';

      status.textContent = 'En progreso';
    }

  });
}

// Enable subSections click — solo responde al bloque visible
document.addEventListener('click', (e) => {

  const activeBlock = document.querySelector(
    '#sidebar-timeline > div:not(.hidden)'
  );
  if (!activeBlock) return;

  const el = e.target.closest('.subStep');
  if (!el || !activeBlock.contains(el)) return;

  window.sidebarState.currentStep = Number(el.dataset.step);

  renderSidebar();
});

// Inicialize
function init () {
  renderSidebar();
}

window.addEventListener('load', init);
window.renderSidebar = renderSidebar;
