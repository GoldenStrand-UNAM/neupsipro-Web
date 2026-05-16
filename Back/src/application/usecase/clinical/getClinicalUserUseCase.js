const ClinicalUserDTO = require('../../dto/clinicalDTO');

class consultClinicalUserUseCase {
  constructor (clinicalRepository) {
    this.clinicalRepository = clinicalRepository;
  }

  async execute ({ id_user }) {

    const clinicalUser = await this.clinicalRepository.fetchClinical({ id_user });

    if (!clinicalUser || clinicalUser.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = clinicalUser[0];

    const cleanUser = ClinicalUserDTO.fromEntity(user);

    return {
      ...cleanUser,
    };
  }
}

module.exports = consultClinicalUserUseCase;
