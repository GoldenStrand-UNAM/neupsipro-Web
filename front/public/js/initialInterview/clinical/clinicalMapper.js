// ----- Auxiliary functions --------------------------------------------------

// Set an input/select/textarea value, falling back to an empty string
function setFieldValue (id, value) {
  const element = document.getElementById(id);

  if (!element) return;

  element.value = value ?? '';
}

// Set a <select> value, swapping the placeholder gray for dark text once an option is loaded
// (mirrors financial/financialMapper.js's setSelectValue, so saved selections look selected)
function setSelectValue (id, value) {
  const select = document.getElementById(id);

  if (!select) return;

  if (value === null || value === undefined || value === '') {
    select.value = '';

    select.classList.remove('text-gray-900');
    select.classList.add('text-gray-400');

    return;
  }

  select.value = String(value);

  select.classList.remove('text-gray-400');
  select.classList.add('text-gray-900');
}

// Set a "true"/"false" <select> from a boolean (or null), with the same
// gray/dark visual indicator as setSelectValue
function setBooleanSelectValue (id, value) {
  setSelectValue(id, value === null || value === undefined ? null : String(value));
}

// Check the radio in a group whose value matches, uncheck the rest
function setRadioValue (name, value) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.checked = radio.value === value;
  });
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEP 1 MAPPER -----------------------------

function mapPhysicalConcerns (personalData) {
  const info = personalData || {};

  setFieldValue('interviewDate', info.interviewDate);
  setFieldValue('interviewerName', info.interviewerName);
  setFieldValue('supportStudentName', info.supportStudentName);
  setFieldValue('companionsName', info.companionsName);
  setFieldValue('companionRelation', info.companionRelation);
  setFieldValue('address', info.address);
  setFieldValue('proofAddress', info.proofAddress);
  setFieldValue('healthcareSystem', info.healthcareSystem);
  setFieldValue('religion', info.religion);
  setSelectValue('schooling', info.schooling);
  setFieldValue('residence', info.residence);
  setSelectValue('fathersSchooling', info.fathersSchooling);
  setSelectValue('mothersSchooling', info.mothersSchooling);
  setFieldValue('currentOcupation', info.ocupation);
}
