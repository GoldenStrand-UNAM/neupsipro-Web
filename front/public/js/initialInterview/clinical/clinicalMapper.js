/* eslint-disable no-undef */

// Renders the data of each adult clinical history section into its inputs.
// `info` is the section object returned by the API (data.data.section),
// whose keys are snake_case (DB columns).

function setVal (id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

// The backend _symptom helper stores combined text (e.g. "Sí: notes" or just "notes").
// For display we just show the full stored string in the plain text input.
function symVal (storedText) {
  const v = (storedText || '').trim();
  if (v === 'No') return '';       // "No" means empty for the text input
  if (v.startsWith('Sí: ')) return v.slice(4).trim();
  if (v === 'Sí') return '';
  return v;
}

// 3.1 Preocupaciones Físicas  (backend subStep 1)
function renderPhysicalConcernsData (info) {
  setVal('headache',             symVal(info.headache));
  // nauseaVomiting and dizziness share the same input in UI
  setVal('nauseaVomiting',       symVal(info.nausea_vomiting) || symVal(info.dizziness));
  // urinaryInconsistency and intestinalProblem share the same input in UI
  setVal('urinaryInconsistency', symVal(info.urinary_inconsistency) || symVal(info.intestinal_problem));
  setVal('skinProblem',          symVal(info.skin_problem));
}

// 3.2 Motor  (backend subStep 2)
function renderMotorData (info) {
  setVal('weakness',        symVal(info.weakness));
  setVal('movementProblem', symVal(info.movement_problem));
  setVal('tremor',          symVal(info.tremor));
  setVal('tics',            symVal(info.tics));
  setVal('balanceProblems', symVal(info.balance_problems));
  setVal('falls',           symVal(info.falls));
}

// 3.3 Sensorial  (backend subStep 3)
function renderSensoryData (info) {
  setVal('sensationLoss',       symVal(info.sensation_loss));
  setVal('visionDif',           symVal(info.vision_dif));
  setVal('wearsGlasses',        symVal(info.wears_glasses));
  setVal('blurryVision',        symVal(info.blurry_vision));
  setVal('hearingLoss',         symVal(info.hearing_loss));
  setVal('ringingEars',         symVal(info.ringing_ears));
  setVal('pain',                symVal(info.pain));
  setVal('phantomLimb',         symVal(info.phantom_limb));
  setVal('phantomLimbDesc',     info.phantom_limb_desc   ?? '');
  setVal('phantomLimbPain',     symVal(info.phantom_limb_pain));
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
  setVal('depression',       symVal(info.depression));
  setVal('anxiety',          symVal(info.anxiety));
  setVal('stress',           symVal(info.stress));
  setVal('sleepingProblems', symVal(info.sleeping_problems));
  setVal('easilyAngry',      symVal(info.easily_angry));
  setVal('veryEmotional',    symVal(info.very_emotional));
  setVal('frustratedEasily', symVal(info.frustrated_easily));
  setVal('changesComments',  info.changes_comments    ?? '');
  setVal('familyProblem',    symVal(info.family_problem));
  setVal('legalProblem',     symVal(info.legal_problem));
  setVal('legalProblemDesc', info.legal_problem_desc  ?? '');
  setVal('financeProblem',   symVal(info.finance_problem));
  setVal('drivingProblem',   symVal(info.driving_problem));
  setVal('controlProblems',  info.control_problems    ?? '');
}

// 3.6 Uso de Sustancias  (backend subStep 6)
function renderSubstanceUseData (info) {
  setVal('drugConsumption',      info.drug_consumption      ?? '');
  setVal('cigaretteConsumption', info.cigarette_consumption ?? '');
  setVal('alcoholConsumption',   info.alcohol_consumption   ?? '');
  setVal('hasAttendedTherapy',   symVal(info.has_attended_therapy));
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
