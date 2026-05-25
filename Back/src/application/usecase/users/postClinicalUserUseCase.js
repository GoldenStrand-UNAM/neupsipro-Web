const ClinicalUser = require('../../../domain/entity/postClinicalUser');
const ClinicalUserDTO = require('../../dto/postClinicalUserDTO');
const validateUser = require('../../validations/postClinicalValidation');

class PostClinicalUserUseCase {
  constructor (clinicalUserRepository, hashingService) {
    this.clinicalUserRepository = clinicalUserRepository;
    this.hashingService = hashingService;
  }

  async execute (user) {
    const sanitizedUser = Object.fromEntries(Object.entries(user)
      .filter(([key]) => key !== '__proto__' && key !== 'constructor')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return [key, trimmed.length === 0 ? null : trimmed];
        }
        return [key, value];
      }));

    // Use Case validation
    const validatedUser = validateUser(sanitizedUser);
    // Password hashing
    const passwordHash = await this.hashingService.hash(user.password);
    // Entity validation
    const clinicalUser = new ClinicalUser (validatedUser);

    const duplicate = await this.clinicalUserRepository.checkDuplicate(clinicalUser);
    if (duplicate)
      throw new Error('El usuario ya se encuentra registrado.');
    else {
      const saved = await this.clinicalUserRepository.postUser({ ...clinicalUser, passwordHash });
      // Map saved into clean DTO for the client
      return ClinicalUserDTO.fromEntity(saved);
    }
  }
}
module.exports = PostClinicalUserUseCase;
