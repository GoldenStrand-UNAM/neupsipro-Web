const clinicalDashboardDTO = require('../../dto/clinicalDashboardDTO');

class GetUserInfoUseCase {
  constructor (dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }
  async execute ({ idUser }) {
    const userInfo = await this.dashboardRepository.fetchInfoUser({ idUser });
    const dto = new clinicalDashboardDTO.userInfoDTO(userInfo);
    console.log(dto);
    return dto;
  }
}
module.exports = GetUserInfoUseCase;
