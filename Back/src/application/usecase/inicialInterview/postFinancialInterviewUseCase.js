const FinancialInterview = require('../../../domain/entity/FinancialInterview');

class postFinancialInterviewUseCase {
  constructor (financialInterviewRepository) {
    this.financialInterviewRepository = financialInterviewRepository;
  }

  // ----------------------------- PATCH Functions ----------------------------

  // ----- Substeps status ----------------------------------------------------
  isFinancialSituationComplete (data) {

    const requiredFields = [
      data.incomes?.salaryBefore,
      data.incomes?.salaryAfter,

      data.expenses?.economicSituation,
      data.expenses?.numEconomicDependents,
    ];

    return requiredFields.every(field =>
      field !== null &&
      field !== undefined &&
      field !== '');
  }

  isEscComplete (data) {

    const requiredFields = [
      data.minIncome,
      data.ocupation,

      data.housing?.realRight,
      data.housing?.housingType,
      data.housing?.publicServices,
      data.housing?.inhomeServices,
      data.housing?.constructionMaterial,
      data.housing?.numBedrooms,
      data.housing?.personsPerBedroom,

      data.familyConditions?.treatmentTime,
      data.familyConditions?.otherProblems,
      data.familyConditions?.familyHealth,
    ];

    return requiredFields.every(field =>
      field !== null &&
      field !== undefined &&
      field !== '' &&
      field !== 100);
  }

  isAmaiComplete (data) {

    const requiredFields = [
      data.lastStudies,
      data.numBathrooms,
      data.numCar,
      data.hasInternet,
      data.hasWorked,
      data.hasBedroom,
    ];

    return requiredFields.every(field =>
      field !== null &&
      field !== undefined &&
      field !== '' &&
      field !== 100);
  }

  // Financial Status
  async isFinancialComplete (id_user_relation) {
    const [rows] = await this.financialInterviewRepository.fetchFinancialProgress({ id_user_relation });

    if (!rows.length) return false;
    const progress = rows[0];

    const completed =
      progress.income_expenses_completed &&
      progress.esc_completed &&
      progress.amai_completed;

    return completed;
  }

  // ----- Validate Section Data ----------------------------------------------
  validateSectionData ({ subStep, body }) {

    switch (subStep) {

      case 1:
        return FinancialInterview.validateFinancialSituation(body);

      case 2:
        return FinancialInterview.validateEscGov(body);

      case 3:
        return FinancialInterview.validateAmai(body);

      default:
        throw new Error('Invalid section');
    }
  }

  async updateData ({
    id_user_relation,
    subStep,
    validatedData,
  }) {
    let completed = false;

    switch (subStep) {

      case 1:
        completed = this.isFinancialSituationComplete(validatedData);
        break;

      case 2:
        completed = this.isEscComplete(validatedData);
        break;

      case 3:
        completed = this.isAmaiComplete(validatedData);
        break;
    }

    // repository transaction
    await this.financialInterviewRepository
      .saveFinancialSection({
        subStep,
        id_user_relation,
        data: validatedData,
        completed,
      });
  }

  async updateProgress (id_user_relation) {
    const complete = await this.isFinancialComplete (id_user_relation);

    if (complete) {
      await this.financialInterviewRepository.updateFinancialProgress({ id_user_relation });

      const [rows] = await this.financialInterviewRepository.fetchInterviewProgress({ id_user_relation });
      const inicialProgress = rows[0];

      if (String(inicialProgress.status) !== 'completed') {
        let status;
        if (
          inicialProgress.identification_completed &&
          inicialProgress.financial_completed &&
          inicialProgress.symptoms_completed
        ) {
          status = 'completed';

        } else if (String(inicialProgress.status) !== 'in_progress') {
          status = 'in_progress';
        } else {
          return;
        }
        await this.financialInterviewRepository.updateInterviewProgress({ id_user_relation, status });
      }
    }
  }

  // ----- Execute the update (main function) ---------------------------------
  async executeUpdate ({
    id_user,
    step,
    subStep,
    body,
  }) {

    // fetch relation
    const relationResult = await this.financialInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    // validate step
    if (step !== 'financial') {
      throw new Error('Section not found');
    }

    // validate entity
    const validatedData = this.validateSectionData({ subStep, body });

    await this.updateData({ id_user_relation, subStep, validatedData });

    await this.updateProgress({ id_user_relation });

    return {
      current_section: subStep + 1,
      saved: true,
    };
  }

}
module.exports = postFinancialInterviewUseCase;
