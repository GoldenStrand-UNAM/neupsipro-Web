const clinicalDashboardDTO = require('../../dto/clinicalDashboardDTO');
const { getPresignedUrl }  = require('../../../infrastructure/external/s3.config');

class GetUserInfoUseCase {
  constructor (dashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }
  async execute ({ idUser }) {
    const userInfo = await this.dashboardRepository.fetchInfoUser({ idUser });
    const dto = new clinicalDashboardDTO.userInfoDTO(userInfo[0]);
    dto.pp = await getPresignedUrl(dto.pp);
    return dto;
  }
}
module.exports = GetUserInfoUseCase;
