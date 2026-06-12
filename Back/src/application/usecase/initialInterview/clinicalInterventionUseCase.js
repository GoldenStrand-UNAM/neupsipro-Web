
class getClinicalInterviewUseCase {
  constructor (clinicalInterviewRepository) {
    this.clinicalInterviewRepository = clinicalInterviewRepository;
  }
 
  // substep mapping to repository fetcher
  _sectionFetcher (subStep, id_user_relation) {
    const repo = this.clinicalInterviewRepository;
    switch (Number(subStep)) {
      case 1: return repo.fetchPhysicalConcerns({ id_user_relation });
      case 2: return repo.fetchMotor({ id_user_relation });
      case 3: return repo.fetchSensory({ id_user_relation });
      case 4: return repo.fetchMentalFunctions({ id_user_relation });
      case 5: return repo.fetchPersonality({ id_user_relation });
      case 6: return repo.fetchSubstanceUse({ id_user_relation });
      case 7: return repo.fetchCalculators({ id_user_relation });
      case 8: return repo.fetchFollowUp({ id_user_relation });
      default: {
        const err = new Error('Invalid section');
        err.status = 400;
        throw err;
      }
    }
  }
 
  async execute ({ id_user, step, subStep }) {
 
    if (step !== 'symptoms') {
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
 
    // user relation
    const relationResult = await this.clinicalInterviewRepository.fetchRelation({ id_user });
    const id_user_relation = relationResult[0][0]?.id_user_relation;
 
    if (!id_user_relation) {
      const err = new Error('Initial interview relation not found');
      err.status = 404;
      throw err;
    }
 
    // section data
    const sectionData = await this._sectionFetcher(section, id_user_relation);
 
    // id user
    const refResult = await this.clinicalInterviewRepository.fetchRefNum({ id_user });
    const refNumber = refResult[0][0]?.reference_number || '';
 
    // global Progress 
    const [progressRows] = await this.clinicalInterviewRepository.fetchInterviewProgress({ id_user_relation });
    const progress = progressRows[0] || {};
 
    const completedSteps = [];
    if (progress.identification_completed) completedSteps.push(1);
    if (progress.financial_completed)      completedSteps.push(2);
    if (progress.symptoms_completed)       completedSteps.push(3);
 
    return {
      current_step: 3,
      current_section: section,
      refNumber,
      data: {
        section: sectionData,
        completedSteps,

        completedSubSteps: [],
        status: progress.status || 'to_start',
      },
    };
  }
}
 
module.exports = getClinicalInterviewUseCase;