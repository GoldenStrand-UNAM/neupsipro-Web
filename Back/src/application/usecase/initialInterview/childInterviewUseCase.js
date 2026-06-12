class getChildInterviewUseCase {
  constructor (childInterviewRepository) {
    this.childInterviewRepository = childInterviewRepository;
  }

  async _sectionFetcher (subStep, id_user_relation, id_user) {
    const repo = this.childInterviewRepository;
    switch (Number(subStep)) {
      case 1: {
        const base = await repo.fetchIdentification({ id_user_relation });
        const siblings = await repo.fetchSiblings({ id_user });
        return { ...base, siblings };
      }
      case 2: return repo.fetchHeredofamilial({ id_user_relation });
      case 3: return repo.fetchPathological({ id_user_relation });
      case 4: return repo.fetchPrenatal({ id_user_relation });
      case 5: return repo.fetchDevelopment({ id_user_relation });
      case 6: return repo.fetchBehavior({ id_user_relation });
      case 7: return repo.fetchSchoolHistory({ id_user_relation });
      case 8: return repo.fetchPhysicalExam({ id_user_relation });
      default: {
        const err = new Error('Invalid section');
        err.status = 400;
        throw err;
      }
    }
  }

  async execute ({ id_user, step, subStep }) {

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

    const sectionData = await this._sectionFetcher(section, id_user_relation, id_user);

    const refResult = await this.childInterviewRepository.fetchRefNum({ id_user });
    const refNumber = refResult[0][0]?.reference_number || '';

    const [progressRows] = await this.childInterviewRepository.fetchInterviewProgress({ id_user_relation });
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

module.exports = getChildInterviewUseCase;