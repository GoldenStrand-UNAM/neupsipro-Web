class deleteApplicationUseCase {
  constructor (testApplicationRepository, testResultsRepository) {
    this.appRepo     = testApplicationRepository;
    this.resultsRepo = testResultsRepository;
  }

  async execute ({ id_user, id_application }) {
    const application = await this.appRepo.fetchApplicationById({ id_application });
    if (!application) { throw { status: 404, message: 'Application not found' }; }
    if (application.idUser !== id_user) { throw { status: 403, message: 'Forbidden' }; }

    await this.resultsRepo.deleteAllResults({ id_application });
    await this.appRepo.deleteApplication({ id_application });

    return { deleted: true };
  }
}

module.exports = deleteApplicationUseCase;
