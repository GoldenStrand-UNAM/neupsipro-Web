let currentDriver = null;

// helpers
function lockScroll () {
  document.querySelectorAll('*').forEach(el => {
    const cs = window.getComputedStyle(el);

    if (
      cs.overflowY === 'auto' ||
      cs.overflowY === 'scroll' ||
      cs.overflow === 'auto' ||
      cs.overflow === 'scroll'
    ) {
      el.dataset.scrollLock = el.style.overflowY || '';
      el.style.overflowY = 'hidden';
    }
  });
}

function unlockScroll () {
  document.querySelectorAll('[data-scroll-lock]').forEach(el => {
    el.style.overflowY = el.dataset.scrollLock || '';
    delete el.dataset.scrollLock;
  });
}

function closeTutorialOnInteraction (e) {

  const insideTutorial = e.target.closest(
    '.driver-popover, .driver-overlay, [data-driver-highlighted]'
  );

  if (insideTutorial) return;

  if (currentDriver) {
    currentDriver.destroy();
  }
}

function enableAutoClose () {
  document.addEventListener('click', closeTutorialOnInteraction, true);
}

function disableAutoClose () {
  document.removeEventListener('click', closeTutorialOnInteraction, true);
}

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

    if (currentDriver) {
      currentDriver.destroy();
      return;
    }

    const res = await fetch(`/api/tutorial?page=${page}`);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const steps = await res.json();

    if (!steps.length) {
      showToast('No hay tutorial disponible', 'error');
      return;
    }

    const elements =
      typeof tutorialElements !== 'undefined'
        ? tutorialElements
        : {};

    currentDriver = window.driver.js.driver({
      showProgress: true,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: 'Finalizar',
      disableActiveInteraction: true,

      onHighlightStarted: (element) => {

        if (element) {
          element.scrollIntoView({
            behavior: 'instant',
            block: 'center',
          });
        }
<<<<<<< HEAD

        lockScroll();
      },

      onDeselected: () => {
        unlockScroll();
      },

      onDestroyed: () => {
        unlockScroll();
        disableAutoClose();
        currentDriver = null;
      },

=======
        lockScroll();
      },
      onDeselected: () => {
        unlockScroll();
      },
      onDestroyed: () => {
        unlockScroll();
      },
>>>>>>> 8ca15d8d60971781a8cd2f58ac2573747844ce5c
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

    enableAutoClose();
    currentDriver.drive();

  } catch (e) {

    unlockScroll();
    disableAutoClose();
    currentDriver = null;

    showToast('Error al cargar el tutorial', 'error');

    // eslint-disable-next-line no-console
    console.error('Tutorial error:', e);
  }
}