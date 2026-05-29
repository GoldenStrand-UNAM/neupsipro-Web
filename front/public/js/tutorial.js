let activeDriver = null;
let tutorialRunning = false;

// helpers
function lockScroll () {
  document.body.style.overflow = 'hidden';
}

function unlockScroll () {
  document.body.style.overflow = '';
}

function blockClicks (e) {
  const isDriverEl = e.target.closest(
    '.driver-popover, .driver-overlay, [data-driver-highlighted]'
  );

  if (!isDriverEl) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function lockInteraction () {
  document.addEventListener('click', blockClicks, true);
}

function unlockInteraction () {
  document.removeEventListener('click', blockClicks, true);
}

// eslint-disable-next-line no-unused-vars
async function startTutorial () {

  // evitar doble ejecución
  if (tutorialRunning) return;

  tutorialRunning = true;

  if (!window.driver?.js?.driver) {
    showToast('Error al cargar el tutorial', 'error');
    tutorialRunning = false;
    return;
  }

  const page = document.body.dataset.module;

  if (!page) {
    showToast('No hay tutorial para esta página', 'error');
    tutorialRunning = false;
    return;
  }

  try {

    // destruir instancia previa si existe
    if (activeDriver) {
      activeDriver.destroy();
      activeDriver = null;
    }

    const res = await fetch(`/api/tutorial?page=${page}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const steps = await res.json();

    if (!steps.length) {
      showToast('No hay tutorial disponible', 'error');
      tutorialRunning = false;
      return;
    }

    const elements =
      typeof tutorialElements !== 'undefined'
        ? tutorialElements
        : {};

    activeDriver = window.driver.js.driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      disableActiveInteraction: true,

      onHighlightStarted: (element) => {
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        lockScroll();
        lockInteraction();
      },

      onDestroyed: () => {
        unlockScroll();
        unlockInteraction();

        activeDriver = null;
        tutorialRunning = false;
      },

      steps: steps
        .filter(
          s =>
            !elements[s.step_order] ||
            document.querySelector(elements[s.step_order])
        )
        .map(s => ({
          ...(elements[s.step_order]
            ? { element: elements[s.step_order] }
            : {}),
          popover: {
            title: s.title,
            description: s.content,
          },
        })),
    });

    activeDriver.drive();

  } catch (e) {

    unlockScroll();
    unlockInteraction();

    tutorialRunning = false;

    showToast('Error al cargar el tutorial', 'error');

    // eslint-disable-next-line no-console
    console.error('Tutorial error:', e);
  }
}