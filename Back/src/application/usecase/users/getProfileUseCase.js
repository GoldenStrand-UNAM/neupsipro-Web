const userProfileDTO = require('../../dto/userProfileDTO');

/**
 * Use Case: Get Profile Use case.
 * Obtains the repository data and transforms them into a DTO.
 */
class getProfileUseCase {
  constructor (profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute (userId) {
    const userEntity = await this.profileRepository.getUserId(userId);

    if (!userEntity) {
      throw new Error('USER_NOT_FOUND');
    }

    return new userProfileDTO(userEntity);
  }
}

module.exports = getProfileUseCase;
