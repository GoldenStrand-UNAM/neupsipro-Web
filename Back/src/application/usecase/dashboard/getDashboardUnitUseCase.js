const { DashboardSummaryDTO } = require('../../dto/dashboardUnitDTO');

class GetDashboardSummaryUseCase {
  constructor (dashboardRepository) {
    this.repo = dashboardRepository;
  }

  async execute () {
    const [counts, age, gender, tests, standByList] = await Promise.all([
      this.repo.fetchCounts(),
      this.repo.fetchAgeDistribution(),
      this.repo.fetchGenderDistribution(),
      this.repo.fetchTestCounts(),
      this.repo.fetchStandByList(),
    ]);

    return new DashboardSummaryDTO({ counts, age, gender, tests, standByList });
  }
}
module.exports = GetDashboardSummaryUseCase;
