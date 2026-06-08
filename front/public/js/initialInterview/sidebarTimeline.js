/* eslint-disable max-lines-per-function */
/* eslint-disable no-undef */

// SubStep list per initial interview phase (current_step)
const subStepConfig = new Map([
  [1, [
    { step: 1, title: 'Datos Personales' },
  ]],
  [2, [
    { step: 1, title: 'Ingresos y Egresos' },
    { step: 2, title: 'ESC Gubernamental' },
    { step: 3, title: 'Cuestionarios AMAI' },
    { step: 4, title: 'Resumen de Resultados' },
  ]],
]);

// Get back info
window.sidebarState = window.sidebarState || {
  phase: 1,
  currentStep: 1,
  completedSteps: [],
};

// Track which phase the subStep list was last built for, to avoid rebuilding on every render
let builtForPhase = null;

// (Re)build the subStep list for the active phase
function buildSidebarItems () {

  const container = document.getElementById('sidebar-timeline-list');
  if (!container) return;

  const phase = window.sidebarState.phase;
  if (phase === builtForPhase) return;

  const items = subStepConfig.get(phase) || [];

  container.innerHTML = '';

  items.forEach(({ step, title }) => {
    const item = document.createElement('div');
    item.className = 'subStep timeline-step';
    item.dataset.step = String(step);

    item.innerHTML = `
      <div class="circle timeline-circle">${step}</div>
      <div>
        <p class="title timeline-title">${title}</p>
        <p class="status timeline-status">Pendiente</p>
      </div>
    `;

    container.appendChild(item);
  });

  builtForPhase = phase;
}

// Render UI
function renderSidebar () {

  buildSidebarItems();

  const steps = document.querySelectorAll('#sidebar-timeline .subStep');
  if (!steps.length) return;
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

// Enable subSections click
document.addEventListener('click', (e) => {

  const el = e.target.closest('#sidebar-timeline .subStep');
  if (!el) return;

  window.sidebarState.currentStep = Number(el.dataset.step);

  renderSidebar();
});

// Inicialize
function init () {
  renderSidebar();
}

window.addEventListener('load', init);
window.renderSidebar = renderSidebar;
