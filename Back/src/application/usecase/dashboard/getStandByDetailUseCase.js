const { DashboardStandByDetailDTO } = require('../../dto/dashboardUnitDTO');
const { getPresignedUrl }  = require('../../../infrastructure/external/s3.config');

class GetStandByDetailUseCase {
  constructor (dashboardRepository) {
    this.repo = dashboardRepository;
  }

  async execute (referenceNumber) {
    const detail = await this.repo.fetchStandByDetail(referenceNumber);

    if (!detail) {
      return new DashboardStandByDetailDTO(null);
    }

    detail.profilePhoto = await getPresignedUrl(detail.profilePhoto);

    return new DashboardStandByDetailDTO(detail);
  }
}
module.exports = GetStandByDetailUseCase;
