/* eslint-disable no-param-reassign */
/* eslint-disable no-undef */

// Get back info
window.sectionsState = window.sectionsState || {
  currentStep: Number(localStorage.getItem("sections_step")) || 1,
  completedSteps: [1],
  subStep: 2,
};

const stepConfig = {
  1: 3,
  2: 4,
  3: 10,
};

// Render UI
// eslint-disable-next-line max-lines-per-function
function renderSections () {

  const steps = document.querySelectorAll("#sections-stepper .step");
  if (!steps.length) return;

  // For each step update UI
  // eslint-disable-next-line max-lines-per-function
  steps.forEach(stepEl => {

    const step = Number(stepEl.dataset.step);
    const total = stepConfig[step];

    const label = stepEl.querySelector(".status-label");
    const check = stepEl.querySelector(".check");
    const underline = stepEl.querySelector(".lineunder");
    const progress = stepEl.querySelector(".progress");
    const title = stepEl.querySelector(".step-title");
    const container = stepEl.querySelector(".dots-container");

    if (!label || !check || !underline || !progress || !title || !container) return;

    // Uptade UI
    label.classList.add("invisible");
    check.classList.add("invisible");
    underline.classList.add("hidden");
    progress.classList.add("hidden");

    title.classList.remove("text-gray-900");
    title.classList.add("text-gray-400");

    container.innerHTML = "";

    // Creat dots
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("div");

      dot.className =
        "dot w-4 h-4 rounded-full border-2 border-gray-300 transition-all duration-200";

      container.appendChild(dot);
    }

    const dots = container.querySelectorAll(".dot");

    // Set as Complete
    if (sectionsState.completedSteps.includes(step)) {
      label.classList.remove("invisible");
      check.classList.remove("invisible");
    }

    // Set as Active
    if (step === sectionsState.currentStep) {

      underline.classList.remove("hidden");
      progress.classList.remove("hidden");

      title.classList.remove("text-gray-400");
      title.classList.add("text-gray-900");

      dots.forEach((dot, i) => {

        const idx = i + 1;

        // Again a reset
        dot.style.backgroundColor = "";
        dot.style.borderColor = "";

        // Set dot as complete
        if (idx < sectionsState.subStep) {
          dot.style.backgroundColor = "#3350A9";
          dot.style.borderColor = "#3350A9";
        }

        // Set dot as actual
        if (idx === sectionsState.subStep) {
          dot.style.borderColor = "#3350A9";
        }
      });
    }

  });
}

// Enable sections click
document.addEventListener("click", (e) => {

  const el = e.target.closest("#sections-stepper .step");
  if (!el) return;

  sectionsState.currentStep = Number(el.dataset.step);
  sectionsState.subStep = 1;

  localStorage.setItem("sections_step", sectionsState.currentStep);

  renderSections();
});

// Inicialize
function init () {
  renderSections();
}

window.addEventListener("load", init);
window.renderSections = renderSections;