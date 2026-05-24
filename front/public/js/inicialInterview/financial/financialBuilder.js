// ----- Auxiliary functions --------------------------------------------------

// Get number or null if the value isn't registered
function getNumberOrNull (id) {

  // eslint-disable-next-line no-undef
  const { value } = document.getElementById(id);

  return value === ''
    ? null
    : Number(value);
}

// Get text or null if the value isn't registered
function getTextOrNull (id) {
  // eslint-disable-next-line no-undef
  const { value } = document.getElementById(id);

  return value === ''
    ? null
    : value;
}

function getSpanNumberOrNull (id) {

  // eslint-disable-next-line no-undef
  const element = document.getElementById(id);

  if (!element) return null;

  const value = element.textContent.trim();

  return value === ''
    ? null
    : Number(value);
}

function getSpanTextOrNull (id) {

  // eslint-disable-next-line no-undef
  const element = document.getElementById(id);

  if (!element) return null;

  const value = element.textContent.trim();

  return value === ''
    ? null
    : value;
}

// ----------------------------------------------------------------------------
// ----------------------------- SUBSTEPS BUILDER -----------------------------

// ----- FINANCIAL ------------------------------------------------------------

// Build incomes
function buildIncomes () {

  return {

    incomeExtra:
      getNumberOrNull('incomeExtra'),

    financialType:
      getTextOrNull('financialType'),

    salaryBefore:
      getNumberOrNull('salaryBefore'),

    salaryAfter:
      getNumberOrNull('salaryAfter'),

    totalIncomes:
      getNumberOrNull('totalIncomes'),
  };
}

// Build contributors
function buildContributors () {

  const contributors = [];

  // eslint-disable-next-line no-undef
  document.querySelectorAll('#contributorsContainer .rounded-xl').forEach(card => {

    const name =
      card.querySelector('.person-name')?.value.trim();

    const relation =
      card.querySelector('.person-relation')?.value.trim();

    const incomeValue =
      card.querySelector('.person-income')?.value;

    contributors.push({

      name:
        name === ''
          ? null
          : name,

      relation:
        relation === ''
          ? null
          : relation,

      income:
        incomeValue === ''
          ? null
          : Number(incomeValue),
    });
  });

  return contributors;
}

// Build expenses
function buildExpenses () {

  return {

    foodExpenses:
      getNumberOrNull('food'),

    rentExpenses:
      getNumberOrNull('rent'),

    servicesExpenses:
      getNumberOrNull('services'),

    gasExpenses:
      getNumberOrNull('gas'),

    educationExpenses:
      getNumberOrNull('school'),

    wardrobeExpenses:
      getNumberOrNull('wardrope'),

    medicalExpenses:
      getNumberOrNull('medic'),

    transportExpenses:
      getNumberOrNull('transport'),

    creditcardExpenses:
      getNumberOrNull('credit'),

    phoneExpenses:
      getNumberOrNull('phone'),

    othersExpenses:
      getNumberOrNull('others'),

    economicSituation:
      getTextOrNull('economicSituation'),

    numEconomicDependents:
      getNumberOrNull('numDependants'),

    totalExpenses:
      getNumberOrNull('totalExpenses'),
  };
}

// Build financial substep
function buildFinancial () {

  return {
    incomes: buildIncomes(),
    expenses: buildExpenses(),
    contributors: buildContributors(),
  };
}

// ----- ESC GOVERMENT --------------------------------------------------------

// Build ESC substep
// eslint-disable-next-line max-lines-per-function
function buildESC () {

  return {

    minIncome:
      getNumberOrNull('minIncome'),

    familyExpenses:
      getNumberOrNull('familyExpenses'),

    ocupation:
      getNumberOrNull('ocupation'),

    housing: {

      realRight:
        getNumberOrNull('realRight'),

      housingType:
        getNumberOrNull('housingType'),

      publicServices:
        getNumberOrNull('publicServices'),

      inhomeServices:
        getNumberOrNull('inhomeServices'),

      constructionMaterial:
        getNumberOrNull('constructionMaterial'),

      numBedrooms:
        getNumberOrNull('numBedrooms'),

      personsPerBedroom:
        getNumberOrNull('personsPerBedroom'),
    },

    familyConditions: {

      treatmentTime:
        getNumberOrNull('treatmentTime'),

      otherProblems:
        getNumberOrNull('otherProblems'),

      familyHealth:
        getNumberOrNull('familyHealth'),
    },

    total:
      getSpanNumberOrNull('totalPuntuation'),

    level:
      getSpanTextOrNull('socioeconomicLevel'),
  };
}

// ----- AMAI QUESTTIONARIE --------------------------------------------------------

// Build AMAI substep
function buildAMAI () {

  return {

    lastStudies:
      getNumberOrNull('lastStudies'),

    numBathrooms:
      getNumberOrNull('numBathrooms'),

    numCar:
      getNumberOrNull('numCar'),

    hasInternet:
      getNumberOrNull('hasInternet'),

    hasWorked:
      getNumberOrNull('hasWorked'),

    hasBedroom:
      getNumberOrNull('hasBedroom'),

    total:
      getSpanNumberOrNull('totalPuntuation'),

    level:
      getSpanTextOrNull('socioeconomicLevel'),
  };
}

// ----- RESULTS --------------------------------------------------------

// Build AMAI substep
function buildResults () {

  return {
    protesisBudget: getNumberOrNull('protesisBudget'),
    notes: getTextOrNull('notes'),
  };
}

// ----------------------------------------------------------------------------
// ------------------------------- MAIN BUILDER -------------------------------

function buildSection (section) {

  switch (section) {

    case 1:
      return buildFinancial();

    case 2:
      return buildESC();

    case 3:
      return buildAMAI();

    case 4:
      return buildResults();

    default:
      return {};
  }
}

// eslint-disable-next-line no-undef
window.buildSection = buildSection;
