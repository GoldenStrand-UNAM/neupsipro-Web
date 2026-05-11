class listClinicsUseCase {
  constructor (clinicalRepository) {
    this.clinicalRepository = clinicalRepository;
  }

  async execute () {
    return await this.clinicalRepository.fetchAll();
  }
}

module.exports = listClinicsUseCase;