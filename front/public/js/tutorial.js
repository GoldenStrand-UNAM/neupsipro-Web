/* global showToast, tutorialElements */

// eslint-disable-next-line no-unused-vars
async function startTutorial () {
  if (!window.driver?.js?.driver) {
    showToast('Error al cargar el tutorial', 'error');
    return;
  }

  const page = document.body.dataset.module;
  if (!page) {
    showToast('No hay tutorial para esta página', 'error');
    return;
  }

  try {
    const res = await fetch(`/api/tutorial?page=${page}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const steps = await res.json();
    if (!steps.length) {
      showToast('No hay tutorial disponible', 'error');
      return;
    }

    // Map step order to element selectors
    const elements = typeof tutorialElements !== 'undefined' ? tutorialElements : {};

    window.driver.js.driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      steps: steps
        .filter(s => !elements[s.step_order] || document.querySelector(elements[s.step_order]))
        .map(s => ({
          ...(elements[s.step_order] ? { element: elements[s.step_order] } : {}),
          popover: { title: s.title, description: s.content },
        })),
    }).drive();

  } catch (e) {
    showToast('Error al cargar el tutorial', 'error');
    // eslint-disable-next-line no-console
    console.error('Tutorial error:', e);
  }
}
