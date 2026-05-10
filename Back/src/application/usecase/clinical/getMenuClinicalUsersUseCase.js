const userClinicalSummaryDTO = require('../../dto/userClinicalSummaryDTO');

class GetMenuClinicalUsersUseCase {
  constructor (userClinicalRepository) {
    this.userClinicalRepository = userClinicalRepository;
  }
  async execute () {
    const users = await this.userClinicalRepository.fetchClinicalUsers();
    if (!users) {
      throw new Error('USER_NOT_FOUND');
    }
    return {
      clinicals: users.map (u => new userClinicalSummaryDTO(u)),
    };
  }
}
module.exports = GetMenuClinicalUsersUseCase;
