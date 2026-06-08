/* eslint-disable no-undef */

// ----------------------------------------------------------------------------
// ------------------------------ IMC CALCULATOR -----------------------------
// Independent module: does not touch the DOM until init() is called.

// Internal amputation percentages (not editable by the user)
const AMPUTATION_PERCENTAGES = {
  BK: 0.059,
  AK: 0.100,
  BILATERAL_BK: 0.118,
  BILATERAL_AK: 0.200,
  BK_AK: 0.160,
  PIE: 0.015,
  AMBOS_PIES: 0.030,
  MANO: 0.007,
  AMBAS_MANOS: 0.014,
  ANTEBRAZO_MANO: 0.023,
  AMBOS_ANTEBRAZOS_MANOS: 0.046,
  BRAZO_COMPLETO: 0.050,
  AMBOS_BRAZOS_COMPLETOS: 0.100,
  PIERNA_COMPLETA: 0.160,
  AMBAS_PIERNAS_COMPLETAS: 0.320,
};

// Patient context set on init() and current calculation result
let state = {
  isChild: false,
  birthdate: null,
  imc: null,
  imcCategory: null,
};

// ----- Auxiliary functions --------------------------------------------------

function round1 (value) {
  return Math.round(value * 10) / 10;
}

function getAgeInMonths (birthdate) {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();

  if (isNaN(birth.getTime())) return null;

  let months = (today.getFullYear() - birth.getFullYear()) * 12;
  months += today.getMonth() - birth.getMonth();

  if (today.getDate() < birth.getDate()) months--;

  return Math.max(months, 0);
}

function getAgeInYears (birthdate) {
  const months = getAgeInMonths(birthdate);
  return months === null ? null : Math.floor(months / 12);
}

// Age range label used as a reference for the pediatric IMC criteria (IMSS)
function getAgeRangeLabel (birthdate) {
  const months = getAgeInMonths(birthdate);

  if (months === null) return '';
  if (months === 0) return 'Al nacer (0 meses)';
  if (months <= 11) return '1–11 meses';
  if (months <= 234) return '1 año–19 años 6 meses';
  if (months <= 719) return '20–59 años';

  return '60 y más';
}

function getAdultCategory (imc) {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25.0) return 'Normal';
  if (imc < 30.0) return 'Sobrepeso';
  if (imc < 35.0) return 'Obesidad I';
  if (imc < 40.0) return 'Obesidad II';

  return 'Obesidad III';
}

function getAmputationPercentage () {
  const type = document.getElementById('amputationType')?.value;

  if (!type) return 0;

  if (type === 'OTRO') {
    const custom = parseFloat(document.getElementById('amputationCustomPct')?.value);
    return isNaN(custom) ? 0 : custom / 100;
  }

  return AMPUTATION_PERCENTAGES[type] ?? 0;
}

// ----- Display toggles -------------------------------------------------------

function toggleAmputationCustomField () {
  const type = document.getElementById('amputationType')?.value;

  document.getElementById('amputationCustomField')
    ?.classList.toggle('hidden', type !== 'OTRO');
}

function toggleAmputationFields () {
  const enabled = document.getElementById('amputationEnabled')?.checked;

  document.getElementById('amputationFields')
    ?.classList.toggle('hidden', !enabled);

  if (!enabled) {
    const type = document.getElementById('amputationType');
    const custom = document.getElementById('amputationCustomPct');
    const prosthesis = document.getElementById('hasProsthesis');

    if (type) type.value = '';
    if (custom) custom.value = '';
    if (prosthesis) prosthesis.checked = false;

    toggleAmputationCustomField();
  }
}

// ----- Calculation -----------------------------------------------------------

function clearResult () {
  state.imc = null;
  state.imcCategory = null;

  const imcResult = document.getElementById('imcResult');
  const imcCategory = document.getElementById('imcCategory');

  if (imcResult) imcResult.textContent = '';
  if (imcCategory) imcCategory.textContent = '';

  document.getElementById('adjustedWeightResult')?.classList.add('hidden');
  document.getElementById('ageRangeResult')?.classList.add('hidden');
  document.getElementById('pediatricNote')?.classList.add('hidden');
  document.getElementById('ageWarning')?.classList.add('hidden');
}

function renderPediatricResult (imc) {
  const ageRangeBlock = document.getElementById('ageRangeResult');
  const ageRangeEl = document.getElementById('ageRange');
  const pediatricNote = document.getElementById('pediatricNote');
  const ageWarning = document.getElementById('ageWarning');

  document.getElementById('imcCategory').textContent = 'Pediátrico';
  state.imcCategory = 'Pediátrico';

  document.getElementById('genderField')?.classList.remove('hidden');

  if (ageRangeEl) ageRangeEl.textContent = getAgeRangeLabel(state.birthdate);
  ageRangeBlock?.classList.remove('hidden');
  pediatricNote?.classList.remove('hidden');

  const age = getAgeInYears(state.birthdate);
  ageWarning?.classList.toggle('hidden', !(age !== null && age >= 18));
}

function renderAdultResult (imc) {
  const category = getAdultCategory(imc);

  document.getElementById('imcCategory').textContent = category;
  state.imcCategory = category;

  document.getElementById('genderField')?.classList.add('hidden');
  document.getElementById('ageRangeResult')?.classList.add('hidden');
  document.getElementById('pediatricNote')?.classList.add('hidden');
  document.getElementById('ageWarning')?.classList.add('hidden');
}

function calculate () {
  const weight = parseFloat(document.getElementById('weight')?.value);
  const size = parseFloat(document.getElementById('size')?.value);

  if (!weight || !size || weight <= 0 || size <= 0) {
    clearResult();
    return;
  }

  const sizeInMeters = size / 100;
  const amputationEnabled = document.getElementById('amputationEnabled')?.checked;
  const adjustedWeightBlock = document.getElementById('adjustedWeightResult');

  let weightForCalc = weight;

  if (amputationEnabled) {
    const amputationPct = getAmputationPercentage();
    weightForCalc = weight / (1 - amputationPct);

    const adjustedWeightEl = document.getElementById('adjustedWeight');
    if (adjustedWeightEl) adjustedWeightEl.textContent = round1(weightForCalc);

    adjustedWeightBlock?.classList.remove('hidden');
  } else {
    adjustedWeightBlock?.classList.add('hidden');
  }

  const imc = round1(weightForCalc / (sizeInMeters ** 2));
  state.imc = imc;

  document.getElementById('imcResult').textContent = imc;

  if (state.isChild) {
    renderPediatricResult(imc);
  } else {
    renderAdultResult(imc);
  }
}

// ----- Event binding ---------------------------------------------------------

function bindEvents () {
  document.getElementById('weight')?.addEventListener('input', calculate);
  document.getElementById('size')?.addEventListener('input', calculate);

  document.getElementById('amputationEnabled')?.addEventListener('change', () => {
    toggleAmputationFields();
    calculate();
  });

  document.getElementById('amputationType')?.addEventListener('change', () => {
    toggleAmputationCustomField();
    calculate();
  });

  document.getElementById('amputationCustomPct')?.addEventListener('input', calculate);
  document.getElementById('hasProsthesis')?.addEventListener('change', calculate);
  document.getElementById('gender')?.addEventListener('change', calculate);
}

// ----------------------------------------------------------------------------
// -------------------------------- PUBLIC API --------------------------------

// Initialize the module with the patient context coming from the GET payload
function init (isChild, birthdate) {
  state = {
    isChild: Boolean(isChild),
    birthdate: birthdate || null,
    imc: null,
    imcCategory: null,
  };

  document.getElementById('genderField')?.classList.toggle('hidden', !state.isChild);

  bindEvents();
  toggleAmputationCustomField();
  calculate();
}

// Expose the current calculation result for the payload builder
function getImcResult () {
  return {
    imc: state.imc,
    imcCategory: state.imcCategory,
  };
}

window.imcCalculator = {
  init,
  getImcResult,
};
