const ClinicalUserDTO = require('../../dto/clinicalDTO');
const UserDTO = require('../../dto/userDTO');

class consultClinicalUserUseCase {
  constructor (clinicalRepository) {
    this.clinicalRepository = clinicalRepository;
  }

  async execute ({ id_user }) {

    const clinicalUser = await this.clinicalRepository.fetchClinical({ id_user });
    const patientsPerClinical = await this.clinicalRepository.fetchPatientsAssigned({ id_user });

    if (!clinicalUser || clinicalUser.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = clinicalUser[0];
    const patients = patientsPerClinical;

    const cleanUser = ClinicalUserDTO.fromEntity(user);
    const cleanPatients = patients.map((patient) => UserDTO.fromEntity(patient));

    return {
      ...cleanUser,
      patients: cleanPatients,
    };
  }
}

module.exports = consultClinicalUserUseCase;
