class ChildInterview {

  // ===HELPERS============

  static _fail (message) {
    const err = new Error(message);
    err.status = 400;
    throw err;
  }

  static _text (value, max = 150, field = 'campo') {
    if (value === undefined || value === null) return null;
    const trimmed = String(value).trim();
    if (trimmed === '') return null;
    if (trimmed.length > max) {
      this._fail(`El campo '${field}' excede el máximo de ${max} caracteres`);
    }
    return trimmed;
  }

  static _int (value, field = 'campo') {
    if (value === undefined || value === null || value === '') return null;
    const n = Number(value);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0) {
      this._fail(`El campo '${field}' debe ser un entero válido >= 0`);
    }
    return n;
  }

  static _bool (value) {
    if (value === undefined || value === null || value === '') return null;
    if (value === true || value === 1 || value === '1') return 1;
    if (value === false || value === 0 || value === '0') return 0;
    const s = String(value).trim().toLowerCase();
    if (['sí', 'si', 's', 'true', 'yes'].includes(s)) return 1;
    if (['no', 'n', 'false'].includes(s)) return 0;
    return null;
  }

  static _float (value, field = 'campo') {
    if (value === undefined || value === null || value === '') return null;
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) {
      this._fail(`El campo '${field}' debe ser un número válido >= 0`);
    }
    return n;
  }

  static _enum (value, allowed, field = 'campo') {
    if (value === undefined || value === null || value === '') return null;
    const v = String(value).trim();
    if (!allowed.includes(v)) {
      this._fail(`El campo '${field}' debe ser uno de: ${allowed.join(', ')}`);
    }
    return v;
  }

  static validateIdentification (body = {}) {
    return {
      full_name:          this._text(body.fullName, 150, 'fullName'),
      bmi:                this._int(body.bmi, 'bmi'),
      schooling:          this._text(body.schooling, 100, 'schooling'),
      school_name:        this._text(body.schoolName, 100, 'schoolName'),
      ocupation:          this._text(body.ocupation, 100, 'ocupation'),
      laterality:         this._text(body.laterality, 50, 'laterality'),
      medical_eligibility: this._text(body.medicalEligibility, 100, 'medicalEligibility'),

      mothers_name:       this._text(body.mothersName, 150, 'mothersName'),
      mothers_age:        this._int(body.mothersAge, 'mothersAge'),
      mothers_schooling:  this._text(body.mothersSchooling, 100, 'mothersSchooling'),
      mothers_profession: this._text(body.mothersProfession, 100, 'mothersProfession'),
      mothers_occpation:  this._text(body.mothersOccupation, 100, 'mothersOccupation'),

      fathers_name:       this._text(body.fathersName, 150, 'fathersName'),
      fathers_age:        this._int(body.fathersAge, 'fathersAge'),
      fathers_schooling:  this._text(body.fathersSchooling, 100, 'fathersSchooling'),
      fathers_profession: this._text(body.fathersProfession, 100, 'fathersProfession'),
      fathers_occupation: this._text(body.fathersOccupation, 100, 'fathersOccupation'),

      marital_status:     this._text(body.maritalStatus, 50, 'maritalStatus'),
      religion:           this._text(body.religion, 50, 'religion'),
      parental_authority: this._text(body.parentalAuthority, 200, 'parentalAuthority'),
      separation_age:     this._int(body.separationAge, 'separationAge'),
      number_siblings:    this._int(body.numberSiblings, 'numberSiblings'),
      siblings:           this._siblings(body.siblings),
    };
  }

  static _siblings (list) {
    if (!Array.isArray(list)) return [];
    return list.map(s => ({
      sibling_name:      this._text(s.name, 100, 'sibling.name'),
      age:               this._int(s.age, 'sibling.age'),
      schooling:         this._text(s.schooling, 100, 'sibling.schooling'),
      school_occupation: this._text(s.schoolOccupation, 150, 'sibling.schoolOccupation'),
    }));
  }

  static validateHeredofamilial (body = {}) {
    return {
      neurological:          this._text(body.neurological, 150, 'neurological'),
      psychiatric:           this._text(body.psychiatric, 150, 'psychiatric'),
      drug_addictions:       this._text(body.drugAddictions, 150, 'drugAddictions'),
      law_conduct:           this._text(body.lawConduct, 150, 'lawConduct'),
      cognitive_development: this._text(body.cognitiveDevelopment, 150, 'cognitiveDevelopment'),
      speech:                this._text(body.speech, 150, 'speech'),
      similar_familiar:      this._text(body.similarFamiliar, 150, 'similarFamiliar'),
    };
  }

  static validatePathological (body = {}) {
    return {
      tbi:           this._text(body.tbi, 500, 'tbi'),
      hospitalized:  this._text(body.hospitalized, 500, 'hospitalized'),
      seizure:       this._text(body.seizure, 500, 'seizure'),
      infectious:    this._text(body.infectious, 500, 'infectious'),
      alergies:      this._text(body.alergies, 500, 'alergies'),
      intoxication:  this._text(body.intoxication, 500, 'intoxication'),
    };
  }

  static validatePrenatal (body = {}) {
    return {
      not_gestate:            this._int(body.notGestate, 'notGestate'),
      misscarriage_number:    this._int(body.misscarriageNumber, 'misscarriageNumber'),
      csection:               this._int(body.csection, 'csection'),
      labors:                 this._int(body.labors, 'labors'),
      wanted:                 this._bool(body.wanted),
      planned:                this._bool(body.planned),
      moms_age:               this._int(body.momsAge, 'momsAge'),
      dads_age:               this._int(body.dadsAge, 'dadsAge'),
      conceive_dif:           this._bool(body.conceiveDif),
      conception_type:        this._text(body.conceptionType, 100, 'conceptionType'),
      obstetric_surveillance: this._bool(body.obstetricSurveillance),
      control_numbers:        this._int(body.controlNumbers, 'controlNumbers'),
      abortion_risk:          this._bool(body.abortionRisk),
      premature_risk:         this._bool(body.prematureRisk),
      emotional_state:        this._text(body.emotionalState, 100, 'emotionalState'),
      feeding:                this._text(body.feeding, 100, 'feeding'),
      diseases:               this._text(body.diseases, 100, 'diseases'),
      medications:            this._text(body.medications, 100, 'medications'),
      exposures:              this._text(body.exposures, 100, 'exposures'),

      // Natales
      natal_labor_hours:      this._text(body.natalLaborHours, 50, 'natalLaborHours'),
      natal_membrane_rupture: this._text(body.natalMembraneRupture, 150, 'natalMembraneRupture'),
      natal_sdg:              this._text(body.natalSdg, 50, 'natalSdg'),
      natal_cried_at_birth:   this._bool(body.natalCriedAtBirth),
      natal_weight_height:    this._text(body.natalWeightHeight, 50, 'natalWeightHeight'),
      natal_apgar:            this._text(body.natalApgar, 50, 'natalApgar'),
      natal_ucin:             this._text(body.natalUcin, 150, 'natalUcin'),
      natal_discharge:        this._text(body.natalDischarge, 150, 'natalDischarge'),
      natal_feeding_type:     this._text(body.natalFeedingType, 100, 'natalFeedingType'),
      natal_bottle_weaning:   this._text(body.natalBottleWeaning, 150, 'natalBottleWeaning'),
      natal_reflux:           this._text(body.natalReflux, 100, 'natalReflux'),
      natal_ablactation:      this._text(body.natalAblactation, 100, 'natalAblactation'),
      natal_comments:         this._text(body.natalComments, 500, 'natalComments'),
    };
  }

  static validateDevelopment (body = {}) {
    return {
      babbling_age:         this._int(body.babblingAge, 'babblingAge'),
      first_word_age:       this._int(body.firstWordAge, 'firstWordAge'),
      first_word:           this._text(body.firstWord, 15, 'firstWord'),
      first_sentence:       this._text(body.firstSentence, 50, 'firstSentence'),
      talk_strangers:       this._bool(body.talkStrangers),
      language_pairs:       this._text(body.languagePairs, 100, 'languagePairs'),
      expressed_ideas:      this._text(body.expressedIdeas, 100, 'expressedIdeas'),
      spoken_comprehension: this._text(body.spokenComprehension, 100, 'spokenComprehension'),
      lenguaje_therapy:     this._bool(body.languageTherapy),
      therapy_info:         this._text(body.therapyInfo, 100, 'therapyInfo'),

      head_support:       this._text(body.headSupport, 100, 'headSupport'),
      turn:               this._text(body.turn, 100, 'turn'),
      seating:            this._text(body.seating, 100, 'seating'),
      crawl:              this._text(body.crawl, 100, 'crawl'),
      standing:           this._text(body.standing, 100, 'standing'),
      motion:             this._text(body.motion, 100, 'motion'),
      practices_sports:   this._text(body.practicesSports, 100, 'practicesSports'),
      trimming:           this._text(body.trimming, 100, 'trimming'),
      letter_legibility:  this._enum(body.letterLegibility, ['Legible', 'Poco legible', 'Ilegible'], 'letterLegibility'),
      motor_coordination: this._text(body.motorCoordination, 100, 'motorCoordination'),
      bicyle:             this._text(body.bicycle, 100, 'bicycle'),
      movement_problems:  this._text(body.movementProblems, 100, 'movementProblems'),

      temper:                  this._text(body.temper, 100, 'temper'),
      social_smile:            this._text(body.socialSmile, 100, 'socialSmile'),
      object_permanence:       this._text(body.objectPermanence, 100, 'objectPermanence'),
      affection_demonstration: this._text(body.affectionDemonstration, 100, 'affectionDemonstration'),
      conduct_strangers:       this._text(body.conductStrangers, 100, 'conductStrangers'),
      childs_conduct:          this._text(body.childsConduct, 100, 'childsConduct'),
      has_friends:             this._text(body.hasFriends, 100, 'hasFriends'),
      friends_to_home:         this._text(body.friendsToHome, 100, 'friendsToHome'),
      invited_to_party:        this._bool(body.invitedToParty),
      other_sex_interest:      this._bool(body.otherSexInterest),
      how_plays:               this._text(body.howPlays, 100, 'howPlays'),
      freetime_activity:       this._text(body.freetimeActivity, 100, 'freetimeActivity'),
      electronics:             this._bool(body.electronics),
      follows_games_rules:     this._bool(body.followsGamesRules),
      new_situation_adaptation: this._text(body.newSituationAdaptation, 100, 'newSituationAdaptation'),

      language_results:        this._text(body.devResults, 150, 'devResults'),
    };
  }

  static validateBehavior (body = {}) {
    return {
      by_themselves_age: this._int(body.byThemselvesAge, 'byThemselvesAge'),
      helps_at_home:     this._text(body.helpsAtHome, 50, 'helpsAtHome'),
      to_do:             this._text(body.toDo, 100, 'toDo'),

      how_eats:          this._text(body.howEats, 100, 'howEats'),
      daily_meals:       this._int(body.dailyMeals, 'dailyMeals'),
      picky_eater:       this._text(body.pickyEater, 100, 'pickyEater'),
      food_not_consumed: this._text(body.foodNotConsumed, 100, 'foodNotConsumed'),
      non_food_substances: this._text(body.nonFoodSubstances, 100, 'nonFoodSubstances'),
      feeding_behavior:  this._text(body.feedingBehavior, 100, 'feedingBehavior'),
      sleep_routine:     this._text(body.sleepRoutine, 100, 'sleepRoutine'),
      sleep_hours:       this._text(body.sleepHours, 100, 'sleepHours'),
      continuous_sleep:  this._text(body.continuousSleep, 100, 'continuousSleep'),
      naps:              this._int(body.naps, 'naps'),
   
      sph_control_age:      this._int(body.sphControlAge, 'sphControlAge'),
      sph_method:           this._int(body.sphMethod, 'sphMethod'),
      daytime_sph_ctrl_age: this._int(body.daytimeSphCtrlAge, 'daytimeSphCtrlAge'),
      sph_regression:       this._text(body.sphRegression, 100, 'sphRegression'),

      type_home_discipline: this._text(body.typeHomeDiscipline, 100, 'typeHomeDiscipline'),
      authority_figure:     this._text(body.authorityFigure, 100, 'authorityFigure'),
      dis_scolding:            this._int(body.disScolding, 'disScolding'),
      dis_physical_punishment: this._int(body.disPhysicalPunishment, 'disPhysicalPunishment'),
      dis_timeout:             this._int(body.disTimeout, 'disTimeout'),
      dis_treat:               this._int(body.disTreat, 'disTreat'),
      dis_convincing:          this._int(body.disConvincing, 'disConvincing'),
      dis_other:               this._text(body.disOther, 100, 'disOther'),
      resp_dis_methods:        this._text(body.respDisMethods, 100, 'respDisMethods'),
      acuerdo_cons_partner:    this._text(body.partnerAgreement, 50, 'partnerAgreement'),
      dis_area_challenges:     this._text(body.disAreaChallenges, 100, 'disAreaChallenges'),
    };
  }

  // school history
  static validateSchoolHistory (body = {}) {
    return {
      school_starting_age: this._int(body.schoolStartingAge, 'schoolStartingAge'),
      school_performance:  this._text(body.schoolPerformance, 100, 'schoolPerformance'),
      preschool:           this._text(body.preschool, 400, 'preschool'),
      primary_school:      this._text(body.primarySchool, 400, 'primarySchool'),
      junior_high:         this._text(body.juniorHigh, 400, 'juniorHigh'),
      highschool:          this._text(body.highschool, 400, 'highschool'),
      school_interest:     this._text(body.schoolInterest, 400, 'schoolInterest'),
      school_aptitudes:    this._text(body.schoolAptitudes, 100, 'schoolAptitudes'),
      failed_year:         this._text(body.failedYear, 50, 'failedYear'),
      particular_classes:  this._text(body.particularClasses, 100, 'particularClasses'),
      part_classes_time:   this._text(body.partClassesTime, 50, 'partClassesTime'),
      extracur_act:        this._text(body.extracurAct, 100, 'extracurAct'),
    };
  }

  static validatePhysicalExam (body = {}) {
    return {
      weight:              this._int(body.weight, 'weight'),
      size:                this._float(body.size, 'size'),
      wc:                  this._text(body.wc, 50, 'wc'),
      temperature:         this._float(body.temperature, 'temperature'),
      bp:                  this._text(body.bp, 50, 'bp'),
      oxygenation:         this._float(body.oxygenation, 'oxygenation'),
      alergies_dermatitis: this._text(body.alergiesDermatitis, 100, 'alergiesDermatitis'),
      functional_support:  this._text(body.functionalSupport, 100, 'functionalSupport'),
      good_hearing:        this._text(body.goodHearing, 100, 'goodHearing'),
      concern_listen:      this._text(body.concernListen, 100, 'concernListen'),
      audiometry:          this._bool(body.audiometry),
      sees_well:           this._text(body.seesWell, 100, 'seesWell'),
      needs_glasses:       this._bool(body.needsGlasses),
      result:              this._text(body.result, 100, 'result'),
      vision_error:        this._text(body.visionError, 150, 'visionError'),
      exam_summary:        this._text(body.examSummary, 500, 'examSummary'),
      exam_treatment_plan: this._text(body.examTreatmentPlan, 500, 'examTreatmentPlan'),
    };
  }
}

module.exports = ChildInterview;