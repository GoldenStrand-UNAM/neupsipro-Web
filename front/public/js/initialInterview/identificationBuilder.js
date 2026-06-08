/* eslint-disable no-undef */

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

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEPS BUILDER -----------------------------

// ----- Datos Personales ------------------------------------------------------

function buildSubStep1Payload () {

  const { imc, imcCategory } = window.imcCalculator?.getImcResult() ?? {};

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
      getIdentificationTextOrNull('schooling'),

    residence:
      getIdentificationTextOrNull('residence'),

    fathersSchooling:
      getIdentificationTextOrNull('fathersSchooling'),

    mothersSchooling:
      getIdentificationTextOrNull('mothersSchooling'),

    ocupation:
      getIdentificationTextOrNull('currentOcupation'),
  };
}

// ----------------------------------------------------------------------------
// ------------------------------- MAIN BUILDER -------------------------------

function buildIdentificationSection (subStep) {

  switch (subStep) {

    case 1:
      return buildSubStep1Payload();

    default:
      return {};
  }
}

window.buildSubStep1Payload = buildSubStep1Payload;
window.buildIdentificationSection = buildIdentificationSection;
