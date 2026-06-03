/* eslint-disable max-lines */
class FinancialInterview {
  constructor ({ id_user, refNumber, current_step, current_section, initialProgress, financialProgress, data }) {
    this.id_user = id_user;
    this.refNumber = refNumber;
    this.current_step = current_step;
    this.current_section = current_section;
    this.financialProgress = financialProgress;

    switch (current_section) {
      case 1:
        this.data = this.mapFinancialSituation(initialProgress, financialProgress, data);
        break;

      case 2:
        this.data = this.mapEscGovernment(initialProgress, financialProgress, data);
        break;

      case 3:
        this.data = this.mapAmai(initialProgress, financialProgress, data);
        break;

      case 4:
        this.data = this.mapResults(initialProgress, financialProgress, data);
        break;

      default:
        throw new Error('Invalid section');
    }
  }

  // ----- Auxiliary functions ------------------------------------------------

  static MAX_MONEY = 1_000_000;

  // Get number or null if the value isn't registered
  static numberOrNull (value) {
    return value === null ||
    value === undefined ||
    value === ''
      ? null
      : Number(value);
  }

  // Money field: null if empty, capped at MAX_MONEY, throws if negative
  static moneyOrNull (value) {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    if (num < 0) throw new Error('Los valores monetarios no pueden ser negativos');
    if (num > FinancialInterview.MAX_MONEY) throw new Error(`El valor no puede superar $${FinancialInterview.MAX_MONEY.toLocaleString('es-MX')}`);
    return num;
  }

  // Get text or null if the value isn't registered
  static textOrNull (value) {
    return value === null ||
    value === undefined ||
    value === ''
      ? null
      : String(value);
  }

  // =============================== Funtions ===============================

  // --------- Financial Situation Functions ---------

  // Salary after + schoolarship = Total Salary
  calculateTotalSalary (data) {
    const salaryAfter =
      FinancialInterview.numberOrNull(data.salary_after_sickness);
    const scholarship =
      FinancialInterview.numberOrNull(data.has_financing_schoolarship);

    return (salaryAfter ?? 0) + (scholarship ?? 0);
  }

  // Build Salary section specification
  buildSalary (base) {
    return {
      hasFinancingSchoolarship:
        FinancialInterview.numberOrNull(base.has_financing_schoolarship),
      financialType:
        FinancialInterview.textOrNull(base.financial_type),
      salaryBeforeSickness:
        FinancialInterview.numberOrNull(base.salary_before_sickness),
      salaryAfterSickness:
        FinancialInterview.numberOrNull(base.salary_after_sickness),

      total: this.calculateTotalSalary(base),
    };
  }

  // Build All income structure
  buildIncome (base, contributors, totalContributors) {
    return {
      salary: this.buildSalary(base),
      contributors: {
        list: contributors,
        total: totalContributors,
      },
      totalIncome: FinancialInterview.numberOrNull(base.total_income),
    };
  }

  // Build All expense structure
  buildExpenses (base) {
    return {
      expenseBreakdown: {
        foodExpenses:
          FinancialInterview.numberOrNull(base.food_expenses),
        rentExpenses:
          FinancialInterview.numberOrNull(base.rent_expenses),
        servicesExpenses:
          FinancialInterview.numberOrNull(base.services_expenses),
        gasExpenses:
          FinancialInterview.numberOrNull(base.gas_expenses),
        educationExpenses:
          FinancialInterview.numberOrNull(base.education_expenses),
        wardrobeExpenses:
          FinancialInterview.numberOrNull(base.wardrobe_expenses),
        medicalExpenses:
          FinancialInterview.numberOrNull(base.medical_expenses),
        transportExpenses:
          FinancialInterview.numberOrNull(base.transport_expenses),
        creditcardExpenses:
          FinancialInterview.numberOrNull(base.creditcard_expenses),
        phoneExpenses:
          FinancialInterview.numberOrNull(base.phone_expenses),
        othersExpenses:
          FinancialInterview.numberOrNull(base.others_expenses),

        totalExpenses:
          FinancialInterview.numberOrNull(base.total_expenses),
      },

      economicSituation:
        FinancialInterview.textOrNull(base.economic_situation),
      numEconomicDependents:
        FinancialInterview.numberOrNull(base.num_economic_dependents),
    };
  }

  // ================================= Map =================================

  // Financial Situation
  mapFinancialSituation (initialProgress, financialProgress, data) {
    const base = data.base || {};
    const contributors = data.contributors || [];

    const formattedContributors = contributors.map(c => ({
      name: c.contributor ?? null,
      relation: c.relation ?? null,
      income: FinancialInterview.numberOrNull(c.income),
    }));

    const totalContributors = formattedContributors
      .reduce((sum, c) => sum + (c.income ?? 0), 0);

    return {
      income: this.buildIncome(base, formattedContributors, totalContributors),
      expenses: this.buildExpenses(base),
      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.mapFinancialProgress(financialProgress),

      refNumber: this.refNumber,
      id_user: this.id_user,
    };
  }

  // ESC Goverment
  mapEscGovernment (initialProgress, financialProgress, datas) {

    const data = Array.isArray(datas) ? datas[0] : datas;

    return {

      minIncome: FinancialInterview.numberOrNull(data.min_income),
      ocupation: FinancialInterview.numberOrNull(data.ocupation),
      familyExpenses: FinancialInterview.numberOrNull(data.family_expenses),

      housing: {
        realRight: FinancialInterview.numberOrNull(data.real_right),
        housingType: FinancialInterview.numberOrNull(data.housing_type),
        publicServices: FinancialInterview.numberOrNull(data.public_services),
        inhomeServices: FinancialInterview.numberOrNull(data.inhome_services),
        constructionMaterial: FinancialInterview.numberOrNull(data.construction_material),
        numBedrooms: FinancialInterview.numberOrNull(data.num_bedrooms),
        personsPerBedroom: FinancialInterview.numberOrNull(data.persons_per_bedroom),
      },

      familyConditions: {
        treatmentTime: FinancialInterview.numberOrNull(data.treatment_time),
        otherProblems: FinancialInterview.numberOrNull(data.other_problems),
        familyHealth: FinancialInterview.numberOrNull(data.family_health),
      },

      extra: {
        totalIncome: FinancialInterview.numberOrNull(data.extra?.total_income),
        totalExpenses: FinancialInterview.numberOrNull(data.extra?.total_expenses),
        economicDependents: FinancialInterview.numberOrNull(data.extra?.num_economic_dependents),
      },

      socioeconomicLevel: FinancialInterview.textOrNull(data.socioeconomic_level),
      total: FinancialInterview.numberOrNull(data.total),

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.mapFinancialProgress(financialProgress),

      refNumber: this.refNumber,
      id_user: this.id_user,
    };
  }

  // AMAI Questionnaire
  mapAmai (initialProgress, financialProgress, datas) {
    const data = Array.isArray(datas) ? datas[0] : datas;

    return {
      lastStudies: FinancialInterview.numberOrNull(data.last_studies),
      numBathrooms: FinancialInterview.numberOrNull(data.num_bathrooms),
      numCar: FinancialInterview.numberOrNull(data.num_car),
      hasInternet: FinancialInterview.numberOrNull(data.has_internet),
      hasWorked: FinancialInterview.numberOrNull(data.has_worked),
      hasBedroom: FinancialInterview.numberOrNull(data.has_bedroom),

      socioeconomicLevel: FinancialInterview.textOrNull(data.socioeconomic_level),
      total: FinancialInterview.numberOrNull(data.total),

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.mapFinancialProgress(financialProgress),

      refNumber: this.refNumber,
      id_user: this.id_user,
    };
  }

  // Results
  mapResults (initialProgress, financialProgress, datas) {
    const data = Array.isArray(datas) ? datas[0] : datas;

    return {
      notes: FinancialInterview.textOrNull(data.notes),
      protesisBudget: FinancialInterview.numberOrNull(data.protesis_budget),
      totalIncome: FinancialInterview.numberOrNull(data.total_income),
      totalExpenses: FinancialInterview.numberOrNull(data.total_expenses),

      government: {
        level: FinancialInterview.textOrNull(data.socio_level_gov),
        score: FinancialInterview.numberOrNull(data.total_gov),
      },

      amai: {
        level: FinancialInterview.textOrNull(data.socio_level_amai),
        score: FinancialInterview.numberOrNull(data.total_amai),
      },

      completedSteps: this.mapInitialProgress(initialProgress),
      completedSubSteps: this.mapFinancialProgress(financialProgress),

      refNumber: this.refNumber,
      id_user: this.id_user,
    };
  }

  // Inicial Interview Progress
  mapInitialProgress (initialProgress) {
    const data = initialProgress[0];

    const completedSteps = [];

    if (data.identification_completed) completedSteps.push(1);
    if (data.financial_completed) completedSteps.push(2);
    if (data.symptoms_completed) completedSteps.push(3);

    return completedSteps;
  }

  // Financial Progress
  mapFinancialProgress (financialProgress) {
    const data = financialProgress;

    const completedSubSteps = [];

    if (data.income_expenses_completed) completedSubSteps.push(1);
    if (data.esc_completed) completedSubSteps.push(2);
    if (data.amai_completed) completedSubSteps.push(3);

    return completedSubSteps;
  }

  // ============================= VALIDATIONS =============================

  // Validate incomes
  static validateIncomes (data) {
    return {
      incomeExtra: this.moneyOrNull(data.incomes?.incomeExtra),
      financialType: this.textOrNull(data.incomes?.financialType),
      salaryBefore: this.moneyOrNull(data.incomes?.salaryBefore),
      salaryAfter: this.moneyOrNull(data.incomes?.salaryAfter),

      totalIncomes: this.numberOrNull(data.incomes?.totalIncomes),
    };
  }

  // Validate expenses
  static validateExpenses (data) {
    return {
      foodExpenses: this.moneyOrNull(data.expenses?.foodExpenses),
      rentExpenses: this.moneyOrNull(data.expenses?.rentExpenses),
      servicesExpenses: this.moneyOrNull(data.expenses?.servicesExpenses),
      gasExpenses: this.moneyOrNull(data.expenses?.gasExpenses),
      educationExpenses: this.moneyOrNull(data.expenses?.educationExpenses),
      wardrobeExpenses: this.moneyOrNull(data.expenses?.wardrobeExpenses),
      medicalExpenses: this.moneyOrNull(data.expenses?.medicalExpenses),
      transportExpenses: this.moneyOrNull(data.expenses?.transportExpenses),
      creditcardExpenses: this.moneyOrNull(data.expenses?.creditcardExpenses),
      phoneExpenses: this.moneyOrNull(data.expenses?.phoneExpenses),
      othersExpenses: this.moneyOrNull(data.expenses?.othersExpenses),

      economicSituation: this.textOrNull(data.expenses?.economicSituation),
      numEconomicDependents: this.numberOrNull(data.expenses?.numEconomicDependents),

      totalExpenses: this.numberOrNull(data.expenses?.totalExpenses),
    };
  }

  // Validate financial situation
  static validateFinancialSituation (data) {
    return {
      incomes: this.validateIncomes(data),
      expenses: this.validateExpenses(data),

      contributors:
      Array.isArray(data.contributors)
        ? data.contributors.map(c => ({
          name: c.name ?? null,
          relation: c.relation ?? null,
          income: this.moneyOrNull(c.income),
        }))
        : [],
    };
  }

  // Validate ESC Government
  static validateEscGov (data) {
    return {
      minIncome: this.numberOrNull(data.minIncome),
      ocupation: this.numberOrNull(data.ocupation),
      familyExpenses: this.numberOrNull(data.familyExpenses),

      housing: {
        realRight: this.numberOrNull(data.housing?.realRight),
        housingType: this.numberOrNull(data.housing?.housingType),
        publicServices: this.numberOrNull(data.housing?.publicServices),
        inhomeServices: this.numberOrNull(data.housing?.inhomeServices),
        constructionMaterial: this.numberOrNull(data.housing?.constructionMaterial),
        numBedrooms: this.numberOrNull(data.housing?.numBedrooms),
        personsPerBedroom: this.numberOrNull(data.housing?.personsPerBedroom),
      },

      familyConditions: {
        treatmentTime: this.numberOrNull(data.familyConditions?.treatmentTime),
        otherProblems: this.numberOrNull(data.familyConditions?.otherProblems),
        familyHealth: this.numberOrNull(data.familyConditions?.familyHealth),
      },

      total: this.numberOrNull(data.total),
      socioeconomicLevel: this.textOrNull(data.level),
    };
  }

  // Validate AMAI Questionnaire
  static validateAmai (data) {
    return {
      lastStudies: this.numberOrNull(data.lastStudies),
      numBathrooms: this.numberOrNull(data.numBathrooms),
      numCar: this.numberOrNull(data.numCar),
      hasInternet: this.numberOrNull(data.hasInternet),
      hasWorked: this.numberOrNull(data.hasWorked),
      hasBedroom: this.numberOrNull(data.hasBedroom),

      total: this.numberOrNull(data.total),
      socioeconomicLevel: this.textOrNull(data.level),
    };
  }

  // Validate Results
  static validateResults (data) {
    return {
      protesisBudget: this.numberOrNull(data.protesisBudget),
      notes: this.textOrNull(data.notes),
    };
  }
}

module.exports = FinancialInterview;
