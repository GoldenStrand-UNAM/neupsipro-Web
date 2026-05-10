const ClinicalUserDTO = require('../../dto/clinicalDTO');

class consultClinicalUserUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  async execute ({ id_user }) {

    const userEntities = await this.userRepository.fetchOne({ id_user });

    if (!userEntities || userEntities.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = userEntities[0];

    const cleanUser = ClinicalUserDTO.fromEntity(user);

    return {
      ...cleanUser,
    };
  }
}

module.exports = consultClinicalUserUseCase;
