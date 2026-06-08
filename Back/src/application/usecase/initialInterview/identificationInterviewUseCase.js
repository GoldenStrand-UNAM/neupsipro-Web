const IdentificationInterview = require('../../../domain/entity/identificationInterview');

class IdentificationInterviewUseCase {
  constructor (identificationInterviewRepository) {
    this.identificationInterviewRepository = identificationInterviewRepository;
  }

  // Build a per-subStep completion list for the sidebar (financial mirrors this
  // via completedSubSteps, but reads it from a dedicated progress table; identification
  // has no such table, so completion is derived from the stored data on every GET)
  async computeCompletedSubSteps ({ id_user, id_user_relation, initialProgress }) {
    const [readOnlyFields, subStep1Data, subStep2Data, subStep3Data, subStep4Data] = await Promise.all([
      this.identificationInterviewRepository.fetchReadOnlyFields({ id_user }),
      this.identificationInterviewRepository.fetchSubStep1Data({ id_user_relation }),
      this.identificationInterviewRepository.fetchSubStep2Data({ id_user_relation }),
      this.identificationInterviewRepository.fetchSubStep3Data({ id_user_relation }),
      this.identificationInterviewRepository.fetchSubStep4Data({ id_user_relation }),
    ]);

    const subStep1 = new IdentificationInterview({ id_user, current_step: 1, current_section: 1, initialProgress, readOnlyFields, data: subStep1Data });
    const subStep2 = new IdentificationInterview({ id_user, current_step: 1, current_section: 2, initialProgress, data: subStep2Data });
    const subStep3 = new IdentificationInterview({ id_user, current_step: 1, current_section: 3, initialProgress, data: subStep3Data });
    const subStep4 = new IdentificationInterview({ id_user, current_step: 1, current_section: 4, initialProgress, data: subStep4Data });

    const completedSubSteps = [];

    if (IdentificationInterview.isSubStep1Complete(subStep1.data.personalData)) completedSubSteps.push(1);
    if (IdentificationInterview.isSubStep2Complete({ ...subStep2.data.familySituation, children: subStep2.data.children })) completedSubSteps.push(2);
    if (IdentificationInterview.isSubStep3Complete(subStep3.data.employmentSituation)) completedSubSteps.push(3);
    if (IdentificationInterview.isSubStep4Complete(subStep4.data)) completedSubSteps.push(4);

    return completedSubSteps;
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

      case 2:
        formattedData = await this.identificationInterviewRepository.fetchSubStep2Data({ id_user_relation });
        break;

      case 3:
        formattedData = await this.identificationInterviewRepository.fetchSubStep3Data({ id_user_relation });
        break;

      case 4:
        formattedData = await this.identificationInterviewRepository.fetchSubStep4Data({ id_user_relation });
        break;
    }

    const completedSubSteps = await this.computeCompletedSubSteps({ id_user, id_user_relation, initialProgress });

    return new IdentificationInterview({
      id_user,
      current_step: initialProgress[0]?.current_step ?? 1,
      current_section: subStep,
      initialProgress,
      readOnlyFields,
      completedSubSteps,
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
