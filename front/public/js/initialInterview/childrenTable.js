// ----------------------------------------------------------------------------
// ------------------------------ CHILDREN TABLE ------------------------------
// Independent module for the dynamic "Hijos" cards (subStep 2 - Situación
// Familiar). Mirrors imcCalculator.js's lazy-init pattern: it does not touch
// the DOM until init() is called. The card markup/behavior mirrors the
// "Personas que aportan" contributors section in financial/subStep1/incomes.ejs.

const CHILDREN_MAX_ROWS = 20;
const CHILDREN_EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

// ----- Auxiliary functions ---------------------------------------------------

function getChildrenElements () {
  return {
    container: document.getElementById('childrenContainer'),
    template: document.getElementById('childRowTemplate'),
    addBtn: document.getElementById('addChildBtn'),
    warning: document.getElementById('childrenLimitWarning'),
  };
}

// Block emojis and enforce maxlength on a card's text input (same rule as subStep1)
function bindChildTextLimit (input) {
  const limit = input.maxLength > 0 ? input.maxLength : null;

  input.addEventListener('input', () => {
    let { value } = input;

    value = value.replace(CHILDREN_EMOJI_REGEX, '');
    if (limit) value = value.slice(0, limit);

    if (value !== input.value) input.value = value;
  });
}

// Update each card's title with its position ("Hijo 1", "Hijo 2"...),
// same convention as updateTitles in incomes.ejs
function updateTitles () {
  const { container } = getChildrenElements();
  if (!container) return;

  container.querySelectorAll('.child-title')
    .forEach((el, i) => {
      el.textContent = `Hijo ${i + 1}`;
    });
}

// Enable/disable "Agregar hijo" and toggle the limit warning based on card count
function updateChildrenLimitState () {
  const { container, addBtn, warning } = getChildrenElements();
  if (!container) return;

  const atLimit = container.querySelectorAll('.child-row').length >= CHILDREN_MAX_ROWS;

  if (addBtn) addBtn.disabled = atLimit;
  warning?.classList.toggle('hidden', !atLimit);
}

// ----------------------------------------------------------------------------
// -------------------------------- PUBLIC API --------------------------------

// Add a card (empty or pre-filled with GET data), respecting the 20-card cap
function addRow (data = {}) {
  const { container, template, addBtn } = getChildrenElements();
  if (!container || !template || !addBtn) return;

  if (container.querySelectorAll('.child-row').length >= CHILDREN_MAX_ROWS) {
    updateChildrenLimitState();
    return;
  }

  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('.child-row');

  const nameInput = row.querySelector('.child-name');
  const ageInput = row.querySelector('.child-age');
  const schoolingInput = row.querySelector('.child-schooling');
  const occupationInput = row.querySelector('.child-occupation');
  const removeBtn = row.querySelector('.remove-child-btn');

  nameInput.value = data.childName ?? '';
  ageInput.value = data.childAge ?? '';
  schoolingInput.value = data.childSchooling ?? '';
  occupationInput.value = data.childOccupation ?? '';

  bindChildTextLimit(nameInput);
  bindChildTextLimit(occupationInput);

  removeBtn.addEventListener('click', () => {
    row.remove();

    updateTitles();
    updateChildrenLimitState();
  });

  // Insert before the "Agregar hijo" button, same as contributorsContainer
  container.insertBefore(clone, addBtn);

  updateTitles();
  updateChildrenLimitState();
}

// Remove a card by its current position among .child-row elements
function removeRow (rowIndex) {
  const { container } = getChildrenElements();
  if (!container) return;

  const row = container.querySelectorAll('.child-row')[rowIndex];
  if (row) row.remove();

  updateTitles();
  updateChildrenLimitState();
}

// Clear the cards and re-render every one from the GET payload
function init (children = []) {
  const { container, addBtn } = getChildrenElements();
  if (!container) return;

  container.querySelectorAll('.child-row').forEach(row => row.remove());

  children.forEach(child => addRow(child));

  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = 'true';
    addBtn.addEventListener('click', () => addRow());
  }

  updateTitles();
  updateChildrenLimitState();
}

// Collect the current values of every card, dropping cards with no name
function getRows () {
  const { container } = getChildrenElements();
  if (!container) return [];

  return Array.from(container.querySelectorAll('.child-row'))
    .map(row => ({
      childName: row.querySelector('.child-name')?.value.trim() ?? '',
      childAge: row.querySelector('.child-age')?.value ?? '',
      childSchooling: row.querySelector('.child-schooling')?.value ?? '',
      childOccupation: row.querySelector('.child-occupation')?.value.trim() ?? '',
    }))
    .filter(child => child.childName !== '');
}

window.childrenTable = {
  init,
  addRow,
  removeRow,
  getRows,
};