const ClinicalUser = require('../../../domain/entity/postClinicalUser');
const ClinicalUserDTO = require('../../dto/postClinicalUserDTO');
const validateUser = require('../../validations/postClinicalValidation');

class EditClinicalUserUseCase {
  constructor (clinicalUserRepository, hashingService) {
    this.clinicalUserRepository = clinicalUserRepository;
    this.hashingService = hashingService;
  }

  async execute (idUser, user) {
    const sanitizedUser = Object.fromEntries(Object.entries(user)
      .filter(([key]) => key !== '__proto__' && key !== 'constructor')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return [key, trimmed.length === 0 ? null : trimmed];
        }
        return [key, value];
      }));

    const validatedUser = validateUser(sanitizedUser, { passwordRequired: false });

    const clinicalUser = new ClinicalUser({ ...validatedUser, idUser });

    let passwordHash;
    if (user.password && user.password.trim().length > 0) {
      passwordHash = await this.hashingService.hash(user.password.trim());
    }

    const saved = await this.clinicalUserRepository.updateUser({ ...clinicalUser, passwordHash });

    return ClinicalUserDTO.fromEntity(saved);
  }
}

module.exports = EditClinicalUserUseCase;