/* eslint-disable no-undef */

// ----- Auxiliary functions --------------------------------------------------

// Get text or null if the value isn't registered
function getTextOrNull (id) {
  const element = document.getElementById(id);

  if (!element) return null;

  const value = element.value.trim();

  return value === ''
    ? null
    : value;
}

// Get number or null if the value isn't registered
function getNumberOrNull (id) {
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
      getTextOrNull('interviewDate'),

    interviewerName:
      getTextOrNull('interviewerName'),

    supportStudentName:
      getTextOrNull('supportStudentName'),

    companionsName:
      getTextOrNull('companionsName'),

    companionRelation:
      getTextOrNull('companionRelation'),

    address:
      getTextOrNull('address'),

    proofAddress:
      getTextOrNull('proofAddress'),

    healthcareSystem:
      getTextOrNull('healthcareSystem'),

    religion:
      getTextOrNull('religion'),

    weight:
      getNumberOrNull('weight'),

    size:
      getNumberOrNull('size'),

    imc:
      imc ?? null,

    imcCategory:
      imcCategory ?? null,

    schooling:
      getTextOrNull('schooling'),

    residence:
      getTextOrNull('residence'),

    fathersSchooling:
      getTextOrNull('fathersSchooling'),

    mothersSchooling:
      getTextOrNull('mothersSchooling'),

    ocupation:
      getTextOrNull('ocupation'),
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
