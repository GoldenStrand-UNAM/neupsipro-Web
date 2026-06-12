/* eslint-disable no-undef */

// Renders the data of each adult clinical history section into its inputs.
// `info` is the section object returned by the API (data.data.section),
// whose keys are snake_case (DB columns).

function setVal (id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

// Parse a combined "Positivo[: notas]" / "Negativo[: notas]" / legacy free
// text / null value into { toggle, notes }. Legacy text (no recognized
// prefix) is shown in the notes field with no toggle selected.
function parsePositiveNegative (stored) {
  const v = (stored || '').trim();
  if (v === 'Positivo' || v === 'Negativo') return { toggle: v, notes: '' };
  if (v.startsWith('Positivo: ')) return { toggle: 'Positivo', notes: v.slice(10).trim() };
  if (v.startsWith('Negativo: ')) return { toggle: 'Negativo', notes: v.slice(10).trim() };
  return { toggle: null, notes: v };
}

// Set the presence <select> to the parsed toggle value, and the notes input
// to the parsed notes text
function applyPositiveNegative (id, stored) {
  const { toggle, notes } = parsePositiveNegative(stored);
  setVal(`${id}_presence`, toggle ?? '');
  setVal(id, notes);
}

// 3.1 Preocupaciones Físicas  (backend subStep 1)
function renderPhysicalConcernsData (info) {
  applyPositiveNegative('headache',             info.headache);
  // nauseaVomiting and dizziness share the same input in UI
  applyPositiveNegative('nauseaVomiting',       info.nausea_vomiting ?? info.dizziness);
  // urinaryInconsistency and intestinalProblem share the same input in UI
  applyPositiveNegative('urinaryInconsistency', info.urinary_inconsistency ?? info.intestinal_problem);
  applyPositiveNegative('skinProblem',          info.skin_problem);
}

// 3.2 Motor  (backend subStep 2)
function renderMotorData (info) {
  applyPositiveNegative('weakness',        info.weakness);
  applyPositiveNegative('movementProblem', info.movement_problem);
  applyPositiveNegative('tremor',          info.tremor);
  applyPositiveNegative('tics',            info.tics);
  applyPositiveNegative('balanceProblems', info.balance_problems);
  applyPositiveNegative('falls',           info.falls);
}

// 3.3 Sensorial  (backend subStep 3)
function renderSensoryData (info) {
  applyPositiveNegative('sensationLoss',       info.sensation_loss);
  applyPositiveNegative('visionDif',           info.vision_dif);
  applyPositiveNegative('wearsGlasses',        info.wears_glasses);
  applyPositiveNegative('blurryVision',        info.blurry_vision);
  applyPositiveNegative('hearingLoss',         info.hearing_loss);
  applyPositiveNegative('ringingEars',         info.ringing_ears);
  applyPositiveNegative('pain',                info.pain);
  applyPositiveNegative('phantomLimb',         info.phantom_limb);
  setVal('phantomLimbDesc',     info.phantom_limb_desc   ?? '');
  applyPositiveNegative('phantomLimbPain',     info.phantom_limb_pain);
  setVal('phantomLimbPainDesc', info.phantom_limb_pain_desc ?? '');
  setVal('score_vision',        info.score_vision  ?? '');
  setVal('score_hearing',       info.score_hearing ?? '');
}

// 3.4 Funciones Mentales  (backend subStep 4)
function renderMentalFunctionsData (info) {
  setVal('cdrResult',         info.cdr_result          ?? '');
  setVal('nihssResult',       info.nihss_result        ?? '');
  setVal('mentalObservation', info.mental_observation  ?? '');
  setVal('score_moca',        info.score_moca          ?? '');
  setVal('score_psychiatric', info.score_psychiatric   ?? '');
}

// 3.5 Personalidad  (backend subStep 5)
function renderPersonalityData (info) {
  console.log(info);
  applyPositiveNegative('depression',       info.depression);
  applyPositiveNegative('anxiety',          info.anxiety);
  applyPositiveNegative('stress',           info.stress);
  applyPositiveNegative('sleepingProblems', info.sleeping_problems);
  applyPositiveNegative('easilyAngry',      info.easily_angry);
  applyPositiveNegative('veryEmotional',    info.very_emotional);
  applyPositiveNegative('frustratedEasily', info.frustrated_easily);
  setVal('changesComments',  info.changes_comments    ?? '');
  applyPositiveNegative('familyProblem',    info.family_problem);
  applyPositiveNegative('legalProblem',     info.legal_problem);
  setVal('legalProblemDesc', info.legal_problem_desc  ?? '');
  applyPositiveNegative('financeProblem',   info.finance_problem);
  applyPositiveNegative('drivingProblem',   info.driving_problem);
  setVal('controlProblems',  info.control_problems    ?? '');
}

// 3.6 Uso de Sustancias  (backend subStep 6)
function renderSubstanceUseData (info) {
  applyPositiveNegative('drugConsumption',      info.drug_consumption);
  applyPositiveNegative('cigaretteConsumption', info.cigarette_consumption);
  applyPositiveNegative('alcoholConsumption',   info.alcohol_consumption);
  applyPositiveNegative('hasAttendedTherapy',   info.has_attended_therapy);
  setVal('therapyType',          info.therapy_type          ?? '');
  setVal('therapyDuration',      info.therapy_duration      ?? '');
  setVal('positiveExperience',   info.positive_experience   ?? '');
  setVal('futureGoals',          info.future_goals          ?? '');
  setVal('observations',         info.observations          ?? '');
  setVal('score_drug_use',       info.score_drug_use        ?? '');
}

// 3.7 Calculadoras  (backend subStep 7)
function renderCalculatorsData (info) {
  setVal('cardiovascularRisk', info.cardiovascular_risk ?? '');
  setVal('qstrokeResult',      info.qstroke_result      ?? '');
  setVal('diabetesRisk',       info.diabetes_risk       ?? '');
  setVal('calcAnalysis',       info.calc_analysis       ?? '');
  setVal('inclusionCriteria',  info.inclusion_criteria  ?? '');
  window.inclusionProtocol?.renderInclusionProtocol(info.inclusion_total);
}

// 3.8 Notas de Seguimiento  (backend subStep 8)
function renderFollowUpData (info) {
  setVal('initialConsultation', info.initial_consultation ?? '');
  setVal('followUpNotes',       info.follow_up_notes      ?? '');
}

// Entry point called by initialInterview.ejs after a GET response.
// `data` is the full API response payload ({ section, completedSteps, ... }).
function renderClinicalData (data) {
  const info    = data.section || {};
  const section = data.currentSection;

  switch (Number(section)) {
    case 1: renderPhysicalConcernsData(info); break;
    case 2: renderMotorData(info);            break;
    case 3: renderSensoryData(info);          break;
    case 4: renderMentalFunctionsData(info);  break;
    case 5: renderPersonalityData(info);      break;
    case 6: renderSubstanceUseData(info);     break;
    case 7: renderCalculatorsData(info);      break;
    case 8: renderFollowUpData(info);         break;
    default: break;
  }
}

window.renderClinicalData = renderClinicalData;
