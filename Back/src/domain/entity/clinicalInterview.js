class ClinicalInterview {

  // ======== HELPERS =================================

  // normalize text: trim + empty 
  static _text (value) {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    return trimmed === '' ? null : trimmed;
  }

  // error helper
  static _fail (message) {
    const err = new Error(message);
    err.status = 400;
    throw err;
  }

  // Validation length
  static _maxLen (value, max, field) {
    if (value !== null && value.length > max) {
      this._fail(`El campo '${field}' excede el máximo de ${max} caracteres`);
    }
    return value;
  }

  // Inclusion criteria score: must be 0, 1 or null
  static _scoreOrNull (value, fieldName) {
    if (value === null || value === undefined || value === '') return null;

    const n = Number(value);
    if (![0, 1].includes(n)) this._fail(`${fieldName} debe ser 0, 1 o null`);

    return n;
  }

  // Inclusion total: integer 0-7 or null
  static _totalOrNull (value, fieldName) {
    if (value === null || value === undefined || value === '') return null;

    const n = Number(value);
    if (!Number.isInteger(n) || n < 0 || n > 7) this._fail(`${fieldName} debe estar entre 0 y 7`);

    return n;
  }

  static _symptom (field = {}, max = 100, name = 'symptom') {
    const presence = this._text(field.presence); // Sí | No | null
    const desc = this._text(field.desc);

    let combined = null;

    if (presence === 'Sí') {
      combined = desc ? `Sí: ${desc}` : 'Sí';
    } else if (presence === 'No') {
      combined = 'No';
    } else if (desc) {
      combined = desc;
    }

    return this._maxLen(combined, max, name);
  }

  // physical concerns
  static validatePhysicalConcerns (body = {}) {
    return {
      headache:               this._symptom(body.headache, 100, 'headache'),
      dizziness:              this._symptom(body.dizziness, 100, 'dizziness'),
      nausea_vomiting:        this._symptom(body.nauseaVomiting, 100, 'nauseaVomiting'),
      urinary_inconsistency:  this._symptom(body.urinaryInconsistency, 100, 'urinaryInconsistency'),
      intestinal_problem:     this._symptom(body.intestinalProblem, 100, 'intestinalProblem'),
      skin_problem:           this._symptom(body.skinProblem, 100, 'skinProblem'),
    };
  }

  // motor
  static validateMotor (body = {}) {
    return {
      weakness:          this._symptom(body.weakness, 100, 'weakness'),
      movement_problem:  this._symptom(body.movementProblem, 100, 'movementProblem'),
      tremor:            this._symptom(body.tremor, 100, 'tremor'),
      tics:              this._symptom(body.tics, 100, 'tics'),
      balance_problems:  this._symptom(body.balanceProblems, 100, 'balanceProblems'),
      falls:             this._symptom(body.falls, 100, 'falls'),
    };
  }

  // sensorial
  static validateSensory (body = {}) {
    return {
      sensation_loss:          this._symptom(body.sensationLoss, 100, 'sensationLoss'),
      vision_dif:              this._symptom(body.visionDif, 100, 'visionDif'),
      wears_glasses:           this._symptom(body.wearsGlasses, 100, 'wearsGlasses'),
      blurry_vision:           this._symptom(body.blurryVision, 100, 'blurryVision'),
      hearing_loss:            this._symptom(body.hearingLoss, 100, 'hearingLoss'),
      ringing_ears:            this._symptom(body.ringingEars, 100, 'ringingEars'),
      pain:                    this._symptom(body.pain, 100, 'pain'),
      phantom_limb:            this._symptom(body.phantomLimb, 100, 'phantomLimb'),
      phantom_limb_desc:       this._maxLen(this._text(body.phantomLimbDesc), 100, 'phantomLimbDesc'),
      phantom_limb_pain:       this._symptom(body.phantomLimbPain, 100, 'phantomLimbPain'),
      phantom_limb_pain_desc:  this._maxLen(this._text(body.phantomLimbPainDesc), 100, 'phantomLimbPainDesc'),
      score_vision:            this._scoreOrNull(body.scoreVision, 'scoreVision'),
      score_hearing:           this._scoreOrNull(body.scoreHearing, 'scoreHearing'),
      inclusion_total:         this._totalOrNull(body.inclusionTotal, 'inclusionTotal'),
    };
  }

  // mental functions calculators and notes
  static validateMentalFunctions (body = {}) {
    return {
      cdr_result:         this._maxLen(this._text(body.cdrResult), 150, 'cdrResult'),
      nihss_result:       this._maxLen(this._text(body.nihssResult), 150, 'nihssResult'),
      mental_observation: this._maxLen(this._text(body.mentalObservation), 500, 'mentalObservation'),
      score_moca:         this._scoreOrNull(body.scoreMoca, 'scoreMoca'),
      score_psychiatric:  this._scoreOrNull(body.scorePsychiatric, 'scorePsychiatric'),
      inclusion_total:    this._totalOrNull(body.inclusionTotal, 'inclusionTotal'),
    };
  }

  // personality
  static validatePersonality (body = {}) {
    return {
      depression:         this._symptom(body.depression, 100, 'depression'),
      anxiety:            this._symptom(body.anxiety, 100, 'anxiety'),
      stress:             this._symptom(body.stress, 100, 'stress'),
      sleeping_problems:  this._symptom(body.sleepingProblems, 100, 'sleepingProblems'),
      easily_angry:       this._symptom(body.easilyAngry, 100, 'easilyAngry'),
      very_emotional:     this._symptom(body.veryEmotional, 100, 'veryEmotional'),
      frustrated_easily:  this._symptom(body.frustratedEasily, 100, 'frustratedEasily'),
      changes_comments:   this._maxLen(this._text(body.changesComments), 100, 'changesComments'),
      family_problem:     this._symptom(body.familyProblem, 100, 'familyProblem'),
      legal_problem:      this._symptom(body.legalProblem, 100, 'legalProblem'),
      legal_problem_desc: this._maxLen(this._text(body.legalProblemDesc), 100, 'legalProblemDesc'),
      finance_problem:    this._symptom(body.financeProblem, 100, 'financeProblem'),
      driving_problem:    this._symptom(body.drivingProblem, 100, 'drivingProblem'),
      control_problems:   this._maxLen(this._text(body.controlProblems), 100, 'controlProblems'),
    };
  }

  // substance_use
  static validateSubstanceUse (body = {}) {
    return {
      drug_consumption:       this._maxLen(this._text(body.drugConsumption), 100, 'drugConsumption'),
      cigarette_consumption:  this._maxLen(this._text(body.cigaretteConsumption), 100, 'cigaretteConsumption'),
      alcohol_consumption:    this._maxLen(this._text(body.alcoholConsumption), 100, 'alcoholConsumption'),
      has_attended_therapy:   this._symptom(body.hasAttendedTherapy, 100, 'hasAttendedTherapy'),
      therapy_type:           this._maxLen(this._text(body.therapyType), 100, 'therapyType'),
      therapy_duration:       this._maxLen(this._text(body.therapyDuration), 100, 'therapyDuration'),
      positive_experience:    this._maxLen(this._text(body.positiveExperience), 300, 'positiveExperience'),
      future_goals:           this._maxLen(this._text(body.futureGoals), 300, 'futureGoals'),
      observations:           this._maxLen(this._text(body.observations), 400, 'observations'),
      score_drug_use:         this._scoreOrNull(body.scoreDrugUse, 'scoreDrugUse'),
      inclusion_total:        this._totalOrNull(body.inclusionTotal, 'inclusionTotal'),
    };
  }

  // calculators
  static validateCalculators (body = {}) {
    return {
      cardiovascular_risk:  this._maxLen(this._text(body.cardiovascularRisk), 200, 'cardiovascularRisk'),
      qstroke_result:       this._maxLen(this._text(body.qstrokeResult), 200, 'qstrokeResult'),
      diabetes_risk:        this._maxLen(this._text(body.diabetesRisk), 200, 'diabetesRisk'),
      calc_analysis:        this._maxLen(this._text(body.calcAnalysis), 400, 'calcAnalysis'),
      inclusion_criteria:   this._maxLen(this._text(body.inclusionCriteria), 400, 'inclusionCriteria'),
    };
  }

  // follow-up notes
  static validateFollowUp (body = {}) {
    return {
      initial_consultation: this._maxLen(this._text(body.initialConsultation), 1000, 'initialConsultation'),
      follow_up_notes:      this._maxLen(this._text(body.followUpNotes), 1000, 'followUpNotes'),
    };
  }
}

module.exports = ClinicalInterview;