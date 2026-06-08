const IdentificationInterview = require('../../../domain/entity/identificationInterview');

class postIdentificationInterviewUseCase {
  constructor (identificationInterviewRepository) {
    this.identificationInterviewRepository = identificationInterviewRepository;
  }

  // Validate Section Data by substep
  validateSectionData ({ subStep, body }) {
    try {
      switch (subStep) {
        case 1:
          return IdentificationInterview.validateSubStep1(body);
        case 2:
          return IdentificationInterview.validateSubStep2(body);
        case 3:
          return IdentificationInterview.validateSubStep3(body);
        case 4:
          return IdentificationInterview.validateSubStep4(body);
        default:
          throw new Error('Invalid section');
      }
    } catch (err) {
      console.error('[identification useCase] validation error:', err.message);
      // Validation failures are client errors (missing/invalid fields), not server errors
      err.status = 400;
      throw err;
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
        completed = IdentificationInterview.isSubStep1Complete(validatedData);
        break;

      case 2:
        completed = IdentificationInterview.isSubStep2Complete(validatedData);
        break;

      case 3:
        completed = IdentificationInterview.isSubStep3Complete(validatedData);
        break;

      case 4:
        completed = IdentificationInterview.isSubStep4Complete(validatedData);
        break;
    }

    // repository transaction
    await this.identificationInterviewRepository
      .saveIdentificationSection({
        subStep,
        id_user_relation,
        data: validatedData,
        completed,
      });
  }

  // "Bubbling": once identification is complete, check if the whole initial interview is done
  async updateProgress (id_user_relation) {
    const [rows] = await this.identificationInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const initialProgress = rows[0];

    if (String(initialProgress.status) !== 'completed') {
      let status;

      if (
        initialProgress.identification_completed &&
        initialProgress.financial_completed &&
        initialProgress.symptoms_completed
      ) {
        status = 'completed';
      } else if (String(initialProgress.status) !== 'in_progress') {
        status = 'in_progress';
      } else {
        return;
      }

      await this.identificationInterviewRepository.updateInterviewProgress({ id_user_relation, status });
    }
  }

  // Execute the update (main function)
  async executeUpdate ({
    id_user,
    step,
    subStep,
    body,
  }) {
    // fetch relation
    const relationResult = await this.identificationInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    if (!id_user_relation) {
      throw new Error('Initial interview relation not found');
    }

    // validate step
    if (step !== 'identification') {
      throw new Error('Section not found');
    }

    // validate entity
    const validatedData = this.validateSectionData({ subStep, body });

    await this.updateData({ id_user_relation, subStep, validatedData });

    await this.updateProgress(id_user_relation);

    return {
      current_section: subStep + 1,
      saved: true,
    };
  }
}

module.exports = postIdentificationInterviewUseCase;
