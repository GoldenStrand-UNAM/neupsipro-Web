const FinancialInterview = require('../../../domain/entity/FinancialInterview');

class FinancialInterviewUseCase {
  constructor (financialInterviewRepository) {
    this.financialInterviewRepository = financialInterviewRepository;
  }

  // ----------------------------- GET Functions -----------------------------

  // Function that gets financial substeps info
  async getSecondStepData ({
    id_user,
    subStep,
    id_user_relation,
    initialProgress,
  }) {
    // fetch financial progress
    const sectionResult = await this.financialInterviewRepository.fetchFinancialProgress({ id_user_relation });

    let formattedData;
    let rawData;

    switch (subStep) {
      case 1:
        rawData = await this.financialInterviewRepository.fetchFinancialSituation({ id_user_relation });
        formattedData = rawData.data;
        break;

      case 2:
        rawData = await this.financialInterviewRepository.fetchEscGov({ id_user_relation });
        formattedData = rawData;
        break;

      case 3:
        rawData = await this.financialInterviewRepository.fetchAmaiQ({ id_user_relation });
        formattedData = rawData[0];
        break;

      case 4:
        rawData = await this.financialInterviewRepository.fetchResults({ id_user_relation });
        formattedData = rawData[0];
        break;
    }

    return new FinancialInterview({
      id_user,
      current_step: initialProgress[0]?.current_step ?? 2,
      current_section: subStep,
      initialProgress,
      financialProgress: sectionResult[0][0],
      data: formattedData,
    });
  }

  async execute ({ id_user, step, subStep }) {
    // fetch refnumber
    const refFetch = await this.financialInterviewRepository.fetchRefNum({ id_user });

    // fetch  relation
    const relationResult = await this.financialInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    // fetch initial interview full progress
    const initialResult = await this.financialInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const initialProgress = initialResult[0];

    // Get data by step
    if (step === 'financial') {
      return await this.getSecondStepData({
        id_user,
        refNumber: refFetch[0][0].reference_number,
        subStep: Number(subStep),
        id_user_relation,
        initialProgress,
      });
    }

    throw new Error('Section not found');
  }
}

module.exports = FinancialInterviewUseCase;
