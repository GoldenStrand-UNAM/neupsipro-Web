const userClinicalSummaryDTO = require('../../dto/userClinicalSummaryDTO');

class GetMenuClinicalUsersUseCase {
  constructor (userClinicalRepository) {
    this.userClinicalRepository = userClinicalRepository;
  }
  async execute () {
    console.log ('pasa a use case ->');
    const users = await this.userClinicalRepository.fetchClinicalUsers();
    console.log(users);
    if (!users) {
      throw new Error('USER_NOT_FOUND');
    }
    return {
      clinicals: users.map (u => new userClinicalSummaryDTO(u)),
    };
  }
}
module.exports = GetMenuClinicalUsersUseCase;
