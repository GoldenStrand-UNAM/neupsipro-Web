// ----- Auxiliary functions --------------------------------------------------
// Named distinctly from financial's helpers (getTextOrNull/getNumberOrNull):
// every <script> here shares one global scope, and financial/financialBuilder.js
// loads later, so identical names would silently overwrite these.

// Get text or null if the value isn't registered
function getIdentificationTextOrNull (id) {
  const element = document.getElementById(id);

  if (!element) return null;

  const value = element.value.trim();

  return value === ''
    ? null
    : value;
}

// Get number or null if the value isn't registered
function getIdentificationNumberOrNull (id) {
  const element = document.getElementById(id);

  if (!element) return null;

  const { value } = element;

  return value === ''
    ? null
    : Number(value);
}

// Get boolean or null from a "true"/"false" select value
function getIdentificationBooleanOrNull (id) {
  const element = document.getElementById(id);

  if (!element) return null;

  const { value } = element;

  if (value === 'true') return true;
  if (value === 'false') return false;

  return null;
}

// Get the value of the checked radio in a group, or null if none is selected
function getIdentificationRadioOrNull (name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);

  return checked ? checked.value : null;
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEPS BUILDER -----------------------------

// ----- Datos Personales ------------------------------------------------------

function buildSubStep1Payload () {

  const { imc, imcCategory } = window.imcCalculator?.getImcResult() ?? {};

  const scoreAge = getIdentificationNumberOrNull('score_age');
  const scoreSchooling = getIdentificationNumberOrNull('score_schooling');

  return {

    interviewDate:
      getIdentificationTextOrNull('interviewDate'),

    interviewerName:
      getIdentificationTextOrNull('interviewerName'),

    supportStudentName:
      getIdentificationTextOrNull('supportStudentName'),

    companionsName:
      getIdentificationTextOrNull('companionsName'),

    companionRelation:
      getIdentificationTextOrNull('companionRelation'),

    address:
      getIdentificationTextOrNull('address'),

    proofAddress:
      getIdentificationTextOrNull('proofAddress'),

    healthcareSystem:
      getIdentificationTextOrNull('healthcareSystem'),

    religion:
      getIdentificationTextOrNull('religion'),

    weight:
      getIdentificationNumberOrNull('weight'),

    size:
      getIdentificationNumberOrNull('size'),

    imc:
      imc ?? null,

    imcCategory:
      imcCategory ?? null,

    schooling:
      getIdentificationNumberOrNull('schooling'),

    residence:
      getIdentificationTextOrNull('residence'),

    fathersSchooling:
      getIdentificationNumberOrNull('fathersSchooling'),

    mothersSchooling:
      getIdentificationNumberOrNull('mothersSchooling'),

    ocupation:
      getIdentificationTextOrNull('currentOcupation'),

    scoreAge,
    scoreSchooling,
  };
}

// ----- Situación Familiar -----------------------------------------------------

function buildSubStep2Payload () {

  const inRelationship = getIdentificationBooleanOrNull('inRelationship');
  const hasChildren = getIdentificationBooleanOrNull('hasChildren');

  return {

    inRelationship,

    // If there is no relationship, send the couple fields explicitly as null
    // instead of omitting them, so no residual values are kept on save
    relationshipDuration:
      inRelationship
        ? getIdentificationNumberOrNull('relationshipDuration')
        : null,

    partnersName:
      inRelationship
        ? getIdentificationTextOrNull('partnersName')
        : null,

    partnersAge:
      inRelationship
        ? getIdentificationNumberOrNull('partnersAge')
        : null,

    partnersOcupation:
      inRelationship
        ? getIdentificationTextOrNull('partnersOcupation')
        : null,

    partnersHealth:
      inRelationship
        ? getIdentificationTextOrNull('partnersHealth')
        : null,

    hasChildren,

    // If there are no children, send an explicit empty array instead of
    // reading the (hidden/cleared) table
    children:
      hasChildren
        ? (window.childrenTable?.getRows() ?? [])
        : [],

    numberFamilyMembers:
      getIdentificationNumberOrNull('numberFamilyMembers'),

    roomieInfo:
      getIdentificationTextOrNull('roomieInfo'),

    aditionalInfo:
      getIdentificationTextOrNull('aditionalInfo'),
  };
}

// ----- Situación Laboral -------------------------------------------------------

function buildSubStep3Payload () {

  const hasJob = getIdentificationBooleanOrNull('hasJob');

  return {

    hasJob,

    // If there is no job, send the employment fields explicitly as null
    // instead of omitting them, so no residual values are kept on save
    workActivity:
      hasJob ? getIdentificationTextOrNull('workActivity') : null,

    stressWork:
      hasJob ? getIdentificationRadioOrNull('stressWork') : null,

    employmentStatus:
      hasJob ? getIdentificationTextOrNull('employmentStatus') : null,

    seniority:
      hasJob ? getIdentificationNumberOrNull('seniority') : null,

    workProblems:
      hasJob ? getIdentificationTextOrNull('workProblems') : null,
  };
}

// ----- Conclusiones -------------------------------------------------------------

function buildSubStep4Payload () {

  return {
    conclusions:
      getIdentificationTextOrNull('conclusions'),
  };
}

// ----------------------------------------------------------------------------
// ------------------------------- MAIN BUILDER -------------------------------

function buildIdentificationSection (subStep) {

  switch (subStep) {

    case 1:
      return buildSubStep1Payload();

    case 2:
      return buildSubStep2Payload();

    case 3:
      return buildSubStep3Payload();

    case 4:
      return buildSubStep4Payload();

    default:
      return {};
  }
}

window.buildSubStep1Payload = buildSubStep1Payload;
window.buildSubStep2Payload = buildSubStep2Payload;
window.buildSubStep3Payload = buildSubStep3Payload;
window.buildSubStep4Payload = buildSubStep4Payload;
window.buildIdentificationSection = buildIdentificationSection;