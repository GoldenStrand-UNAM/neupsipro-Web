/* eslint-disable no-undef */

// Builds the request body for each adult clinical history section.
// Keys are camelCase: that is exactly what ClinicalInterview.validate* reads from the body.

function val (id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// Build the { presence, notes } payload for a Positivo/Negativo + notas field
function positiveNegative (id) {
  return { presence: val(`${id}_presence`) || null, notes: val(id) };
}

// Get an inclusion-criteria score input's value as a number, or null if empty
function score (id) {
  const el = document.getElementById(id);
  return el && el.value !== '' ? Number(el.value) : null;
}

// 3.1 Preocupaciones Físicas  (backend subStep 1)
// UI agrupa: nauseaVomiting + dizziness en un input; urinaryInconsistency + intestinalProblem en otro.
function buildPhysicalConcerns () {
  const nausea  = positiveNegative('nauseaVomiting');
  const urinary = positiveNegative('urinaryInconsistency');
  return {
    headache:             positiveNegative('headache'),
    dizziness:            nausea,           // "mareo" agrupado con náusea en UI
    nauseaVomiting:       nausea,
    urinaryInconsistency: urinary,
    intestinalProblem:    urinary,          // agrupado en UI
    skinProblem:          positiveNegative('skinProblem'),
  };
}

// 3.2 Motor  (backend subStep 2)
function buildMotor () {
  return {
    weakness:        positiveNegative('weakness'),
    movementProblem: positiveNegative('movementProblem'),
    tremor:          positiveNegative('tremor'),
    tics:            positiveNegative('tics'),
    balanceProblems: positiveNegative('balanceProblems'),
    falls:           positiveNegative('falls'),
  };
}

// 3.3 Sensorial  (backend subStep 3)
function buildSensory () {
  return {
    sensationLoss:       positiveNegative('sensationLoss'),
    visionDif:           positiveNegative('visionDif'),
    wearsGlasses:        positiveNegative('wearsGlasses'),
    blurryVision:        positiveNegative('blurryVision'),
    hearingLoss:         positiveNegative('hearingLoss'),
    ringingEars:         positiveNegative('ringingEars'),
    pain:                positiveNegative('pain'),
    phantomLimb:         positiveNegative('phantomLimb'),
    phantomLimbDesc:     val('phantomLimbDesc'),
    phantomLimbPain:     positiveNegative('phantomLimbPain'),
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
    depression:          positiveNegative('depression'),
    anxiety:             positiveNegative('anxiety'),
    stress:              positiveNegative('stress'),
    sleepingProblems:    positiveNegative('sleepingProblems'),
    easilyAngry:         positiveNegative('easilyAngry'),
    veryEmotional:       positiveNegative('veryEmotional'),
    frustratedEasily:    positiveNegative('frustratedEasily'),
    changesComments:     val('changesComments'),
    familyProblem:       positiveNegative('familyProblem'),
    legalProblem:        positiveNegative('legalProblem'),
    legalProblemDesc:    val('legalProblemDesc'),
    financeProblem:      positiveNegative('financeProblem'),
    drivingProblem:      positiveNegative('drivingProblem'),
    controlProblems:     val('controlProblems'),
  };
}

// 3.6 Uso de Sustancias  (backend subStep 6)
function buildSubstanceUse () {
  return {
    drugConsumption:      positiveNegative('drugConsumption'),
    cigaretteConsumption: positiveNegative('cigaretteConsumption'),
    alcoholConsumption:   positiveNegative('alcoholConsumption'),
    hasAttendedTherapy:   positiveNegative('hasAttendedTherapy'),
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
