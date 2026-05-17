const userProfileDTO = require('../../dto/userProfileDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

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
    const rawPhotoKey = userEntity.profilePhoto;

    const signedUrl = await getPresignedUrl(rawPhotoKey);

    userEntity.profilePhoto = signedUrl;

    return new userProfileDTO(userEntity);
  }
}

module.exports = getProfileUseCase;
