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

// Read-only patient data (users + user_info)
function mapReadOnlyFields (readOnly) {
  const info = readOnly || {};

  setFieldValue('referenceNumber', info.referenceNumber);
  setFieldValue('fullName', info.fullName);
  setFieldValue('email', info.email);
  setFieldValue('userPhone', info.phone);
  setFieldValue('birthdate', info.birthdate);
  setFieldValue('age', info.age);
  setFieldValue('laterality', info.laterality);
}

// Editable Datos Generales fields
function mapPersonalData (personalData) {
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

// Map weight/size and (re)initialize the IMC calculator with the patient context,
// so the first calculation runs with the correct is_child/birthdate before the inputs are filled
function mapImcFields (personalData, readOnly) {
  window.imcCalculator?.init(readOnly?.isChild, readOnly?.birthdate);

  setFieldValue('weight', personalData?.weight);
  setFieldValue('size', personalData?.size);

  document.getElementById('weight')?.dispatchEvent(new Event('input'));
  document.getElementById('size')?.dispatchEvent(new Event('input'));
}

// Populate the DOM with the GET payload of subStep 1 (Datos Personales)
function mapSubStep1 (data) {
  const info = data || {};

  mapReadOnlyFields(info.readOnly);
  mapPersonalData(info.personalData);
  mapImcFields(info.personalData, info.readOnly);
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEP 2 MAPPER -----------------------------

// Couple and household fields (Situación Familiar)
function mapFamilySituation (familySituation) {
  const info = familySituation || {};

  setBooleanSelectValue('inRelationship', info.inRelationship);
  setFieldValue('relationshipDuration', info.relationshipDuration);
  setFieldValue('partnersName', info.partnersName);
  setFieldValue('partnersAge', info.partnersAge);
  setFieldValue('partnersOcupation', info.partnersOcupation);
  setFieldValue('partnersHealth', info.partnersHealth);

  setBooleanSelectValue('hasChildren', info.hasChildren);
  setFieldValue('numberFamilyMembers', info.numberFamilyMembers);
  setFieldValue('roomieInfo', info.roomieInfo);
  setFieldValue('aditionalInfo', info.aditionalInfo);

  // Re-trigger the inline toggle scripts in _coupleFields.ejs/_childrenTable.ejs,
  // so the detail blocks show/hide according to the loaded values
  // (same dispatch pattern mapImcFields uses for weight/size)
  document.getElementById('inRelationship')?.dispatchEvent(new Event('change'));
  document.getElementById('hasChildren')?.dispatchEvent(new Event('change'));
}

// Populate the DOM with the GET payload of subStep 2 (Situación Familiar)
function mapSubStep2 (data) {
  const info = data || {};

  mapFamilySituation(info.familySituation);
  window.childrenTable?.init(info.children || []);
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEP 3 MAPPER -----------------------------

// Employment fields (Situación Laboral)
function mapEmploymentSituation (employmentSituation) {
  const info = employmentSituation || {};

  setBooleanSelectValue('hasJob', info.hasJob);
  setFieldValue('workActivity', info.workActivity);
  setRadioValue('stressWork', info.stressWork);
  setFieldValue('employmentStatus', info.employmentStatus);
  setFieldValue('seniority', info.seniority);
  setFieldValue('workProblems', info.workProblems);

  // Re-trigger the inline toggle script in _employmentFields.ejs,
  // so the detail block shows/hides according to the loaded value
  document.getElementById('hasJob')?.dispatchEvent(new Event('change'));
}

// Populate the DOM with the GET payload of subStep 3 (Situación Laboral)
function mapSubStep3 (data) {
  const info = data || {};

  mapEmploymentSituation(info.employmentSituation);
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEP 4 MAPPER -----------------------------

// Populate the DOM with the GET payload of subStep 4 (Conclusiones)
function mapSubStep4 (data) {
  const info = data || {};

  setFieldValue('conclusions', info.conclusions);

  // Re-trigger the shared char-counter (data-target="conclusions"), so it
  // reflects the loaded text length right away (same dispatch pattern mapImcFields uses)
  document.getElementById('conclusions')?.dispatchEvent(new Event('input'));
}

window.mapSubStep1 = mapSubStep1;
window.mapSubStep2 = mapSubStep2;
window.mapSubStep3 = mapSubStep3;
window.mapSubStep4 = mapSubStep4;