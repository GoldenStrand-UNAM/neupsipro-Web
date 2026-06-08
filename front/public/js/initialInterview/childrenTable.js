
// ----------------------------------------------------------------------------
// ------------------------------ CHILDREN TABLE ------------------------------
// Independent module for the dynamic "Hijos" table (subStep 2 - Situación
// Familiar). Mirrors imcCalculator.js's lazy-init pattern: it does not touch
// the DOM until init() is called.

const CHILDREN_MAX_ROWS = 20;
const CHILDREN_EMOJI_REGEX = /\p{Extended_Pictographic}/gu;

const CHILD_SCHOOLING_OPTIONS = [
  'Sin escolaridad',
  'Primaria',
  'Secundaria',
  'Bachillerato',
  'Licenciatura',
  'Posgrado',
];

// ----- Auxiliary functions ---------------------------------------------------

function getChildrenElements () {
  return {
    body: document.getElementById('childrenTableBody'),
    template: document.getElementById('childRowTemplate'),
    addBtn: document.getElementById('addChildBtn'),
    warning: document.getElementById('childrenLimitWarning'),
  };
}

// Block emojis and enforce maxlength on a row's text input (same rule as subStep1)
function bindChildTextLimit (input) {
  const limit = input.maxLength > 0 ? input.maxLength : null;

  input.addEventListener('input', () => {
    let { value } = input;

    value = value.replace(CHILDREN_EMOJI_REGEX, '');
    if (limit) value = value.slice(0, limit);

    if (value !== input.value) input.value = value;
  });
}

// Toggle a select's text color between placeholder gray and selected dark,
// same convention as setSelectValue in identificationMapper.js / financialMapper.js
function bindChildSelectVisual (select) {
  const updateColor = () => {
    if (select.value) {
      select.classList.remove('text-gray-400');
      select.classList.add('text-gray-900');
    } else {
      select.classList.remove('text-gray-900');
      select.classList.add('text-gray-400');
    }
  };

  select.addEventListener('change', updateColor);
  updateColor();
}

// Enable/disable "Agregar hijo" and toggle the limit warning based on row count
function updateChildrenLimitState () {
  const { body, addBtn, warning } = getChildrenElements();
  if (!body) return;

  const atLimit = body.children.length >= CHILDREN_MAX_ROWS;

  if (addBtn) addBtn.disabled = atLimit;
  warning?.classList.toggle('hidden', !atLimit);
}

// ----------------------------------------------------------------------------
// -------------------------------- PUBLIC API --------------------------------

// Add a row (empty or pre-filled with GET data), respecting the 20-row cap
function addRow (data = {}) {
  const { body, template } = getChildrenElements();
  if (!body || !template) return;

  if (body.children.length >= CHILDREN_MAX_ROWS) {
    updateChildrenLimitState();
    return;
  }

  const clone = template.content.cloneNode(true);
  const row = clone.querySelector('.child-row');

  const nameInput = row.querySelector('.child-name');
  const ageInput = row.querySelector('.child-age');
  const schoolingSelect = row.querySelector('.child-schooling');
  const occupationInput = row.querySelector('.child-occupation');
  const removeBtn = row.querySelector('.remove-child-btn');

  nameInput.value = data.childName ?? '';
  ageInput.value = data.childAge ?? '';
  occupationInput.value = data.childOccupation ?? '';

  if (data.childSchooling && CHILD_SCHOOLING_OPTIONS.includes(data.childSchooling)) {
    schoolingSelect.value = data.childSchooling;
  }

  bindChildTextLimit(nameInput);
  bindChildTextLimit(occupationInput);
  bindChildSelectVisual(schoolingSelect);

  removeBtn.addEventListener('click', () => {
    const index = Array.from(body.children).indexOf(row);
    removeRow(index);
  });

  body.appendChild(clone);

  updateChildrenLimitState();
}

// Remove a row by its current index in the table
function removeRow (rowIndex) {
  const { body } = getChildrenElements();
  if (!body) return;

  const row = body.children[rowIndex];
  if (row) row.remove();

  updateChildrenLimitState();
}

// Clear the table and re-render every row from the GET payload
function init (children = []) {
  const { body, addBtn } = getChildrenElements();
  if (!body) return;

  body.innerHTML = '';

  children.forEach(child => addRow(child));

  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = 'true';
    addBtn.addEventListener('click', () => addRow());
  }

  updateChildrenLimitState();
}

// Collect the current values of every row, dropping rows with no name
function getRows () {
  const { body } = getChildrenElements();
  if (!body) return [];

  return Array.from(body.querySelectorAll('.child-row'))
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
