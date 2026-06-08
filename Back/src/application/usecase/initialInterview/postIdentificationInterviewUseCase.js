const IdentificationInterview = require('../../../domain/entity/identificationInterview');

class postIdentificationInterviewUseCase {
  constructor (identificationInterviewRepository) {
    this.identificationInterviewRepository = identificationInterviewRepository;
  }

  // ----- Substeps status functions (check completion) ----
  isSubStep1Complete (data) {
    const requiredFields = [
      data.interviewDate,
      data.interviewerName,
      data.address,
      data.healthcareSystem,
      data.weight,
      data.size,
      data.schooling,
      data.residence,
      data.fathersSchooling,
      data.mothersSchooling,
      data.ocupation,
    ];

    return requiredFields.every(field =>
      field !== null && field !== undefined && field !== '');
  }

  // Validate Section Data by substep
  validateSectionData ({ subStep, body }) {
    switch (subStep) {
      case 1:
        return IdentificationInterview.validateSubStep1(body);
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
        completed = this.isSubStep1Complete(validatedData);
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
