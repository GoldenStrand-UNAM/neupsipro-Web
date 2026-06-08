/* eslint-disable max-lines-per-function */

// Get back info
window.sidebarState = window.sidebarState || {
  phase: 1,
  currentStep: 1,
  completedSteps: [],
};

// Show the item group matching the active phase, hide the other
function switchPhaseGroup () {
  const identGroup = document.getElementById('sidebar-identification-steps');
  const financialGroup = document.getElementById('sidebar-financial-steps');

  if (identGroup) identGroup.classList.toggle('hidden', window.sidebarState.phase !== 1);
  if (financialGroup) financialGroup.classList.toggle('hidden', window.sidebarState.phase !== 2);
}

// Render UI
function renderSidebar () {

  switchPhaseGroup();

  const groupId = window.sidebarState.phase === 1
    ? 'sidebar-identification-steps'
    : 'sidebar-financial-steps';

  const group = document.getElementById(groupId);
  if (!group) return;

  const steps = group.querySelectorAll('.subStep');
  if (!steps.length) return;

  // For each step update UI
  steps.forEach(stepEl => {

    const step = Number(stepEl.dataset.step);

    const circle = stepEl.querySelector('.circle');
    const title = stepEl.querySelector('.title');
    const status = stepEl.querySelector('.status');

    if (!circle || !title || !status) return;

    // Reset to Pendiente
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

    // Set as Active (overrides Completado if navigating back to a completed step)
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
