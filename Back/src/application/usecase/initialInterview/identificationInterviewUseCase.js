const IdentificationInterview = require('../../../domain/entity/identificationInterview');

class IdentificationInterviewUseCase {
  constructor (identificationInterviewRepository) {
    this.identificationInterviewRepository = identificationInterviewRepository;
  }

  async getFirstStepData ({
    id_user,
    subStep,
    id_user_relation,
    initialProgress,
  }) {
    let formattedData;
    let readOnlyFields;

    switch (subStep) {
      case 1:
        readOnlyFields = await this.identificationInterviewRepository.fetchReadOnlyFields({ id_user });
        formattedData = await this.identificationInterviewRepository.fetchSubStep1Data({ id_user_relation });
        break;
    }

    return new IdentificationInterview({
      id_user,
      current_step: initialProgress[0]?.current_step ?? 1,
      current_section: subStep,
      initialProgress,
      readOnlyFields,
      data: formattedData,
    });
  }

  async execute ({ id_user, step, subStep }) {
    // fetch relation
    const relationResult = await this.identificationInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    // fetch initial interview full progress
    const initialResult = await this.identificationInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const initialProgress = initialResult[0];

    // Get data by step
    if (step === 'identification') {
      return await this.getFirstStepData({
        id_user,
        subStep: Number(subStep),
        id_user_relation,
        initialProgress,
      });
    }

    throw new Error('Section not found');
  }
}

module.exports = IdentificationInterviewUseCase;
