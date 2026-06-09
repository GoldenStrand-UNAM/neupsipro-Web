/* eslint-disable no-undef */

// Renders the data of each pediatric section into its inputs.
// `info` is the section object returned by the API (data.data.section),
// whose keys are snake_case (the DB columns).

function setVal (id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

// Inverse of childBuilder.combineSymptom: takes the stored text and splits it
// back into presence (Sí/No) + description, same convention as the adult interview.
function parseSymptom (value) {
  const v = (value || '').trim();
  if (v === '') return { presence: '', desc: '' };
  if (v === 'No') return { presence: 'No', desc: '' };
  if (v === 'Sí') return { presence: 'Sí', desc: '' };
  if (v.startsWith('Sí:')) return { presence: 'Sí', desc: v.slice(3).trim() };
  return { presence: '', desc: v };
}

// 3.1 Antecedentes Heredofamiliares  (backend subStep 2)
function renderHeredofamilialData (info) {
  // camelCase del form  ->  columna snake_case en BD
  const map = {
    neurological:         'neurological',
    psychiatric:          'psychiatric',
    drugAddictions:       'drug_addictions',
    lawConduct:           'law_conduct',
    cognitiveDevelopment: 'cognitive_development',
    speech:               'speech',
  };

  Object.entries(map).forEach(([cat, col]) => {
    const { presence, desc } = parseSymptom(info[col]);
    setVal(`${cat}Presence`, presence);
    setVal(`${cat}Desc`, desc);
  });
}

// Inverse of childBuilder.combinePathology: extracts each labeled part back into
// its card field. (Stopgap; el dato vive todo en una columna varchar(500).)
function parsePathology (value) {
  const v = value || '';
  const grab = (label) => {
    const m = v.match(new RegExp(`${label}:\\s*([^|]*)`));
    return m ? m[1].trim() : '';
  };
  return { edad: grab('Edad'), desc: grab('Descripción'), conseq: grab('Consecuencia') };
}

// 3.2 Antecedentes Patológicos  (backend subStep 3)
function renderPathologicalData (info) {
  const cols = ['tbi', 'hospitalized', 'seizure', 'infectious', 'alergies', 'intoxication'];
  cols.forEach((col) => {
    const { edad, desc, conseq } = parsePathology(info[col]);
    setVal(`${col}Edad`, edad);
    setVal(`${col}Desc`, desc);
    setVal(`${col}Conseq`, conseq);
  });
}

// 3.3 Antecedentes Prenatales  (backend subStep 4)
function boolToSelect (v) {
  if (v === 1 || v === '1') return 'Sí';
  if (v === 0 || v === '0') return 'No';
  return '';
}

function renderPrenatalData (info) {
  // campos directos (number / text): id del form -> columna snake_case
  const direct = {
    notGestate: 'not_gestate', misscarriageNumber: 'misscarriage_number', csection: 'csection',
    labors: 'labors', momsAge: 'moms_age', dadsAge: 'dads_age', controlNumbers: 'control_numbers',
    conceptionType: 'conception_type', emotionalState: 'emotional_state', feeding: 'feeding',
    diseases: 'diseases', medications: 'medications', exposures: 'exposures',
    // Natales
    natalLaborHours: 'natal_labor_hours', natalMembraneRupture: 'natal_membrane_rupture',
    natalSdg: 'natal_sdg', natalWeightHeight: 'natal_weight_height', natalApgar: 'natal_apgar',
    natalUcin: 'natal_ucin', natalDischarge: 'natal_discharge', natalFeedingType: 'natal_feeding_type',
    natalBottleWeaning: 'natal_bottle_weaning', natalReflux: 'natal_reflux',
    natalAblactation: 'natal_ablactation', natalComments: 'natal_comments',
  };
  // campos Sí/No (tinyint en BD)
  const bools = {
    wanted: 'wanted', planned: 'planned', conceiveDif: 'conceive_dif',
    obstetricSurveillance: 'obstetric_surveillance', abortionRisk: 'abortion_risk',
    prematureRisk: 'premature_risk', natalCriedAtBirth: 'natal_cried_at_birth',
  };

  Object.entries(direct).forEach(([id, col]) => setVal(id, info[col]));
  Object.entries(bools).forEach(([id, col]) => setVal(id, boolToSelect(info[col])));
}

// 3.4 Antecedentes de Desarrollo Generales  (backend subStep 5)
function renderDevelopmentData (info) {
  // Campos directos (number / text / enum): id del form -> columna snake_case
  const direct = {
    babblingAge: 'babbling_age', firstWordAge: 'first_word_age', firstWord: 'first_word',
    firstSentence: 'first_sentence', languagePairs: 'language_pairs', expressedIdeas: 'expressed_ideas',
    spokenComprehension: 'spoken_comprehension', therapyInfo: 'therapy_info',
    headSupport: 'head_support', turn: 'turn', seating: 'seating', crawl: 'crawl',
    standing: 'standing', motion: 'motion', practicesSports: 'practices_sports', trimming: 'trimming',
    letterLegibility: 'letter_legibility', motorCoordination: 'motor_coordination',
    bicycle: 'bicyle', movementProblems: 'movement_problems',
    temper: 'temper', socialSmile: 'social_smile', objectPermanence: 'object_permanence',
    affectionDemonstration: 'affection_demonstration', conductStrangers: 'conduct_strangers',
    childsConduct: 'childs_conduct', hasFriends: 'has_friends', friendsToHome: 'friends_to_home',
    howPlays: 'how_plays', freetimeActivity: 'freetime_activity',
    newSituationAdaptation: 'new_situation_adaptation',
    devResults: 'language_results',
  };
  // Campos Sí/No (tinyint en BD)
  const bools = {
    talkStrangers: 'talk_strangers', languageTherapy: 'lenguaje_therapy',
    invitedToParty: 'invited_to_party', otherSexInterest: 'other_sex_interest',
    electronics: 'electronics', followsGamesRules: 'follows_games_rules',
  };

  Object.entries(direct).forEach(([id, col]) => setVal(id, info[col]));
  Object.entries(bools).forEach(([id, col]) => setVal(id, boolToSelect(info[col])));
}

// 3.5 Conductas en General  (backend subStep 6)
function renderBehaviorData (info) {
  // Todos los campos son directos (number / int-likert / text): id -> columna.
  const direct = {
    byThemselvesAge: 'by_themselves_age', helpsAtHome: 'helps_at_home', toDo: 'to_do',
    howEats: 'how_eats', dailyMeals: 'daily_meals', pickyEater: 'picky_eater',
    foodNotConsumed: 'food_not_consumed', nonFoodSubstances: 'non_food_substances',
    feedingBehavior: 'feeding_behavior', sleepRoutine: 'sleep_routine', sleepHours: 'sleep_hours',
    continuousSleep: 'continuous_sleep', naps: 'naps',
    sphControlAge: 'sph_control_age', sphMethod: 'sph_method',
    daytimeSphCtrlAge: 'daytime_sph_ctrl_age', sphRegression: 'sph_regression',
    typeHomeDiscipline: 'type_home_discipline', authorityFigure: 'authority_figure',
    disScolding: 'dis_scolding', disPhysicalPunishment: 'dis_physical_punishment',
    disTimeout: 'dis_timeout', disTreat: 'dis_treat', disConvincing: 'dis_convincing',
    disOther: 'dis_other', respDisMethods: 'resp_dis_methods',
    partnerAgreement: 'acuerdo_cons_partner', disAreaChallenges: 'dis_area_challenges',
  };
  Object.entries(direct).forEach(([id, col]) => setVal(id, info[col]));
}

// 3.6 Historia Escolar  (backend subStep 7)
function parseGrade (value) {
  const v = value || '';
  const grab = (label) => {
    const m = v.match(new RegExp(`${label}:\\s*([^|]*)`));
    return m ? m[1].trim() : '';
  };
  return { escuela: grab('Escuela'), promedio: grab('Promedio'), comentarios: grab('Comentarios') };
}

function renderSchoolHistoryData (info) {
  // Campos directos: id del form -> columna snake_case
  const direct = {
    schoolStartingAge: 'school_starting_age', schoolPerformance: 'school_performance',
    schoolInterest: 'school_interest', schoolAptitudes: 'school_aptitudes',
    failedYear: 'failed_year', particularClasses: 'particular_classes',
    partClassesTime: 'part_classes_time', extracurAct: 'extracur_act',
  };
  Object.entries(direct).forEach(([id, col]) => setVal(id, info[col]));

  // Grados (combinados): id del form -> columna
  const grades = {
    preschool: 'preschool', primarySchool: 'primary_school',
    juniorHigh: 'junior_high', highschool: 'highschool',
  };
  Object.entries(grades).forEach(([id, col]) => {
    const { escuela, promedio, comentarios } = parseGrade(info[col]);
    setVal(`${id}Escuela`, escuela);
    setVal(`${id}Promedio`, promedio);
    setVal(`${id}Comentarios`, comentarios);
  });
}

// 3.7 Exploración Física Pediátrica  (backend subStep 8)
function renderPhysicalExamData (info) {
  // Campos directos (int / float / text): id del form -> columna snake_case
  const direct = {
    weight: 'weight', size: 'size', wc: 'wc', temperature: 'temperature', bp: 'bp',
    oxygenation: 'oxygenation', alergiesDermatitis: 'alergies_dermatitis',
    functionalSupport: 'functional_support', goodHearing: 'good_hearing',
    concernListen: 'concern_listen', result: 'result', seesWell: 'sees_well',
    visionError: 'vision_error', examSummary: 'exam_summary',
    examTreatmentPlan: 'exam_treatment_plan',
  };
  // Campos Sí/No (tinyint en BD)
  const bools = { audiometry: 'audiometry', needsGlasses: 'needs_glasses' };

  Object.entries(direct).forEach(([id, col]) => setVal(id, info[col]));
  Object.entries(bools).forEach(([id, col]) => setVal(id, boolToSelect(info[col])));
}

// Dispatches the rendering according to the loaded section.
function renderPediatricData () {

  const childData = window.childData;
  if (!childData) return;

  const info = childData.data?.section || {};

  switch (Number(childData.current_section)) {
    case 2: renderHeredofamilialData(info); break;
    case 3: renderPathologicalData(info); break;
    case 4: renderPrenatalData(info); break;
    case 5: renderDevelopmentData(info); break;
    case 6: renderBehaviorData(info); break;
    case 7: renderSchoolHistoryData(info); break;
    case 8: renderPhysicalExamData(info); break;
    default: break;
  }
}

window.renderPediatricData = renderPediatricData;
