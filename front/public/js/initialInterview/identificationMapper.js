
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

window.mapSubStep1 = mapSubStep1;
