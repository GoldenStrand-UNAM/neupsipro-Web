const FinancialInterview = require('../../../domain/entity/FinancialInterview');

class FinancialInterviewUseCase {
  constructor (financialInterviewRepository) {
    this.financialInterviewRepository = financialInterviewRepository;
  }

  // ----------------------------- GET Functions -----------------------------

  // Function that gets financial substeps info
  async getSecondStepData ({
    refNumber,
    id_user,
    subStep,
    id_user_relation,
    inicialProgress,
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
      refNumber,
      current_step: inicialProgress[0].current_step,
      current_section: subStep,
      inicialProgress,
      financialProgress: sectionResult[0][0],
      data: formattedData,
    });
  }

  async execute ({ refNumber, step, subStep }) {

    const res = await this.financialInterviewRepository.fetchUserId({ refNumber });
    const id_user = res[0][0].id_user;

    // fetch  relation
    const relationResult = await this.financialInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    // fetch inicial interview full progress
    const inicialResult = await this.financialInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const inicialProgress = inicialResult[0];

    // Get data by step
    if (step === 'financial') {
      return await this.getSecondStepData({
        refNumber,
        id_user,
        subStep: Number(subStep),
        id_user_relation,
        inicialProgress,
      });
    }

    throw new Error('Section not found');
  }
}

module.exports = FinancialInterviewUseCase;
