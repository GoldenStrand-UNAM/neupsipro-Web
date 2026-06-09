const ChildInterview = require('../../../domain/entity/childInterview');

class postChildInterviewUseCase {
  constructor (childInterviewRepository) {
    this.childInterviewRepository = childInterviewRepository;
  }

  // Validates the request body according to the current interview section
  validateSectionData ({ subStep, body }) {
    switch (Number(subStep)) {
      case 1: return ChildInterview.validateIdentification(body);
      case 2: return ChildInterview.validateHeredofamilial(body);
      case 3: return ChildInterview.validatePathological(body);
      case 4: return ChildInterview.validatePrenatal(body);
      case 5: return ChildInterview.validateDevelopment(body);
      case 6: return ChildInterview.validateBehavior(body);
      case 7: return ChildInterview.validateSchoolHistory(body);
      case 8: return ChildInterview.validatePhysicalExam(body);
      default: {
        const err = new Error('Invalid section');
        err.status = 400;
        throw err;
      }
    }
  }

  // porgress
  async updateProgress ({ id_user_relation, subStep, validatedData }) {

    // if completing symptoms section, mark symptoms as completed
    // Only mark complete if the physical exam form has at least one non-null field
    const hasData = validatedData && Object.values(validatedData).some(v => v !== null && v !== undefined);
    const symptomsCompleted = Number(subStep) === 8 && hasData;
    if (symptomsCompleted) {
      await this.childInterviewRepository.updateSymptomsProgress({
        id_user_relation,
        completed: true,
      });
    }

    const [rows] = await this.childInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const progress = rows[0];
    if (!progress) return;
    if (String(progress.status) === 'completed') return;

    let status;
    const allDone =
      progress.identification_completed &&
      progress.financial_completed &&
      (symptomsCompleted || progress.symptoms_completed);

    if (allDone) {
      status = 'completed';
    } else if (String(progress.status) !== 'in_progress') {
      status = 'in_progress';
    } else {
      return;
    }

    await this.childInterviewRepository.updateInterviewProgress({ id_user_relation, status });
  }

  // Fetches the current section data according to subStep
  async executeUpdate ({ id_user, step, subStep, body }) {

    if (step !== 'child') {
      const err = new Error('Section not found');
      err.status = 400;
      throw err;
    }

    const section = Number(subStep);
    if (!Number.isInteger(section) || section < 1 || section > 8) {
      const err = new Error('Invalid section');
      err.status = 400;
      throw err;
    }

    const relationResult = await this.childInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    if (!id_user_relation) {
      const err = new Error('Initial interview relation not found');
      err.status = 404;
      throw err;
    }

    // Validate the request body 
    const validatedData = this.validateSectionData({ subStep: section, body });

    // Save the section data.
    await this.childInterviewRepository.saveChildSection({
      subStep: section,
      id_user,            
      id_user_relation,
      data: validatedData,
    });

    await this.updateProgress({ id_user_relation, subStep: section, validatedData });

    return {
      current_section: section + 1,
      saved: true,
    };
  }
}

module.exports = postChildInterviewUseCase;