class DashboardRepository {
  async fetchCounts () { throw new Error('fetchCounts() must be implemented'); }
  async fetchAgeDistribution ()     { throw new Error('fetchAgeDistribution() must be implemented'); }
  async fetchGenderDistribution ()  { throw new Error('fetchGenderDistribution() must be implemented'); }
  async fetchTestCounts ()  { throw new Error('fetchTestCounts() must be implemented'); }
  async fetchStandByList () { throw new Error('fetchStandByList() must be implemented'); }
  async fetchStandByDetail (_refNum)    { throw new Error('fetchStandByDetail() must be implemented'); }
}
module.exports = DashboardRepository;
