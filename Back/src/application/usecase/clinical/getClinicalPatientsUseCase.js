const ClinicalPatientDTO = require('../../dto/clinicalPatientDTO');

class consultClinicalUserUseCase {
  constructor (clinicalRepository) {
    this.clinicalRepository = clinicalRepository;
  }

  async execute ({ id_user,  page = 1, limit = 10  }) {

    // eslint-disable-next-line max-len
    const { patients, totalPages, page: currentPage } = await this.clinicalRepository.fetchPatientsAssigned({ id_user, page, limit });

    const cleanPatients = patients.map((patient) => ClinicalPatientDTO.fromEntity(patient));

    return {
      patients: cleanPatients,
      totalPages,
      page: currentPage,
    };
  }
}

module.exports = consultClinicalUserUseCase;
