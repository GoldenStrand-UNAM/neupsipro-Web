/* eslint-disable no-undef */

// Builds the request body for each adult clinical history section.
// Keys are camelCase: that is exactly what ClinicalInterview.validate* reads from the body.

function val (id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Wraps a plain text value into a symptom object { desc }.
// The backend _symptom helper stores it as-is when no presence is set.
function symptom (id) {
  return { desc: val(id) };
}

// Get an inclusion-criteria score input's value as a number, or null if empty
function score (id) {
  const el = document.getElementById(id);
  return el && el.value !== '' ? Number(el.value) : null;
}

// 3.1 Preocupaciones Físicas  (backend subStep 1)
// UI agrupa: nauseaVomiting + dizziness en un input; urinaryInconsistency + intestinalProblem en otro.
function buildPhysicalConcerns () {
  const nausea  = symptom('nauseaVomiting');
  const urinary = symptom('urinaryInconsistency');
  return {
    headache:             symptom('headache'),
    dizziness:            nausea,           // "mareo" agrupado con náusea en UI
    nauseaVomiting:       nausea,
    urinaryInconsistency: urinary,
    intestinalProblem:    urinary,          // agrupado en UI
    skinProblem:          symptom('skinProblem'),
  };
}

// 3.2 Motor  (backend subStep 2)
function buildMotor () {
  return {
    weakness:        symptom('weakness'),
    movementProblem: symptom('movementProblem'),
    tremor:          symptom('tremor'),
    tics:            symptom('tics'),
    balanceProblems: symptom('balanceProblems'),
    falls:           symptom('falls'),
  };
}

// 3.3 Sensorial  (backend subStep 3)
function buildSensory () {
  return {
    sensationLoss:       symptom('sensationLoss'),
    visionDif:           symptom('visionDif'),
    wearsGlasses:        symptom('wearsGlasses'),
    blurryVision:        symptom('blurryVision'),
    hearingLoss:         symptom('hearingLoss'),
    ringingEars:         symptom('ringingEars'),
    pain:                symptom('pain'),
    phantomLimb:         symptom('phantomLimb'),
    phantomLimbDesc:     val('phantomLimbDesc'),
    phantomLimbPain:     symptom('phantomLimbPain'),
    phantomLimbPainDesc: val('phantomLimbPainDesc'),
    scoreVision: score('score_vision'),
    scoreHearing: score('score_hearing'),
  };
}

// 3.4 Funciones Mentales  (backend subStep 4)
function buildMentalFunctions () {
  return {
    cdrResult:          val('cdrResult'),
    nihssResult:        val('nihssResult'),
    mentalObservation:  val('mentalObservation'),
    scoreMoca: score('score_moca'),
    scorePsychiatric: score('score_psychiatric'),
  };
}

// 3.5 Personalidad  (backend subStep 5)
function buildPersonality () {
  return {
    depression:          symptom('depression'),
    anxiety:             symptom('anxiety'),
    stress:              symptom('stress'),
    sleepingProblems:    symptom('sleepingProblems'),
    easilyAngry:         symptom('easilyAngry'),
    veryEmotional:       symptom('veryEmotional'),
    frustratedEasily:    symptom('frustratedEasily'),
    changesComments:     val('changesComments'),
    familyProblem:       symptom('familyProblem'),
    legalProblem:        symptom('legalProblem'),
    legalProblemDesc:    val('legalProblemDesc'),
    financeProblem:      symptom('financeProblem'),
    drivingProblem:      symptom('drivingProblem'),
    controlProblems:     val('controlProblems'),
  };
}

// 3.6 Uso de Sustancias  (backend subStep 6)
function buildSubstanceUse () {
  return {
    drugConsumption:      val('drugConsumption'),
    cigaretteConsumption: val('cigaretteConsumption'),
    alcoholConsumption:   val('alcoholConsumption'),
    hasAttendedTherapy:   symptom('hasAttendedTherapy'),
    therapyType:          val('therapyType'),
    therapyDuration:      val('therapyDuration'),
    positiveExperience:   val('positiveExperience'),
    futureGoals:          val('futureGoals'),
    observations:         val('observations'),
    scoreDrugUse: score('score_drug_use'),
  };
}

// 3.7 Calculadoras  (backend subStep 7)
function buildCalculators () {
  return {
    cardiovascularRisk:  val('cardiovascularRisk'),
    qstrokeResult:       val('qstrokeResult'),
    diabetesRisk:        val('diabetesRisk'),
    calcAnalysis:        val('calcAnalysis'),
    inclusionCriteria:   val('inclusionCriteria'),
  };
}

// 3.8 Notas de Seguimiento  (backend subStep 8)
function buildFollowUp () {
  return {
    initialConsultation: val('initialConsultation'),
    followUpNotes:       val('followUpNotes'),
  };
}

// Returns the body matching the given section (1-6).
function buildClinicalSection (section) {
  switch (Number(section)) {
    case 1: return buildPhysicalConcerns();
    case 2: return buildMotor();
    case 3: return buildSensory();
    case 4: return buildMentalFunctions();
    case 5: return buildPersonality();
    case 6: return buildSubstanceUse();
    case 7: return buildCalculators();
    case 8: return buildFollowUp();
    default: return {};
  }
}

window.buildClinicalSection = buildClinicalSection;
