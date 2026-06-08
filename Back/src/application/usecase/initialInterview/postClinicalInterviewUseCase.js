const ClinicalInterview = require('../../../domain/entity/clinicalInterview');

class postClinicalInterviewUseCase {
  constructor (clinicalInterviewRepository) {
    this.clinicalInterviewRepository = clinicalInterviewRepository;
  }

  // Validate data for each section
  validateSectionData ({ subStep, body }) {
    switch (Number(subStep)) {
      case 1: return ClinicalInterview.validatePhysicalConcerns(body);
      case 2: return ClinicalInterview.validateMotor(body);
      case 3: return ClinicalInterview.validateSensory(body);
      case 4: return ClinicalInterview.validateMentalFunctions(body);
      case 5: return ClinicalInterview.validatePersonality(body);
      case 6: return ClinicalInterview.validateSubstanceUse(body);
      default: {
        const err = new Error('Invalid section');
        err.status = 400;
        throw err;
      }
    }
  }

  async updateProgress ({ id_user_relation, subStep }) {

    const symptomsCompleted = Number(subStep) === 6;
    if (symptomsCompleted) {
      await this.clinicalInterviewRepository.updateSymptomsProgress({
        id_user_relation,
        completed: true,
      });
    }

    // global Progress
    const [rows] = await this.clinicalInterviewRepository.fetchInterviewProgress({ id_user_relation });
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

    await this.clinicalInterviewRepository.updateInterviewProgress({ id_user_relation, status });
  }

  async executeUpdate ({ id_user, step, subStep, body }) {

    // validate step
    if (step !== 'symptoms') {
      const err = new Error('Section not found');
      err.status = 400;
      throw err;
    }

    const section = Number(subStep);
    if (!Number.isInteger(section) || section < 1 || section > 6) {
      const err = new Error('Invalid section');
      err.status = 400;
      throw err;
    }

    // user relation
    const relationResult = await this.clinicalInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;

    if (!id_user_relation) {
      const err = new Error('Initial interview relation not found');
      err.status = 404;
      throw err;
    }

    // validate data
    const validatedData = this.validateSectionData({ subStep: section, body });

    // save
    await this.clinicalInterviewRepository.saveClinicalSection({
      subStep: section,
      id_user_relation,
      data: validatedData,
    });

    // progress
    await this.updateProgress({ id_user_relation, subStep: section });

    return {
      current_section: section + 1,
      saved: true,
    };
  }
}

module.exports = postClinicalInterviewUseCase;