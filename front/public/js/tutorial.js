async function startTutorial() {
  // check if driver.js is loaded
  if (!window.driver?.js?.driver) {
    showToast('Error al cargar el tutorial', 'error');
    console.error('window.driver:', window.driver);
    return;
  }

  const page = document.body.dataset.module;
  if (!page) {
    showToast('No hay tutorial para esta página', 'error');
    return;
  }

  // call API to get tutorial steps by page
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
      nextBtnText:  'Siguiente',
      prevBtnText:  'Anterior',
      doneBtnText:  'Finalizar',
      steps: steps
      // only include element if it exists in the DOM
        .filter(s => !elements[s.step_order] || document.querySelector(elements[s.step_order]))
        .map(s => ({
          ...(elements[s.step_order] ? { element: elements[s.step_order] } : {}),
          // title and description for the tutorial
          popover: { title: s.title, description: s.content },
        })),
    }).drive();

  } catch(e) {
    console.error('Tutorial error:', e);
    showToast('Error al cargar el tutorial', 'error');
  }
}