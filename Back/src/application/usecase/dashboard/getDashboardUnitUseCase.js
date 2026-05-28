const { DashboardSummaryDTO } = require('../../dto/dashboardUnitDTO');
const { AgeBucketEntity } = require('../../../domain/entity/dashboardUnitEntity');

// Ages buckets for the age distribution
const AGE_BUCKETS = [
  { label: '0-17',  min: 0,   max: 17  },
  { label: '18-30', min: 18,  max: 30  },
  { label: '31-50', min: 31,  max: 50  },
  { label: '51-60', min: 51,  max: 60  },
  { label: '61-80', min: 61,  max: 80  },
  { label: '81+',   min: 81,  max: Infinity },
];

class GetDashboardSummaryUseCase {
  constructor (dashboardRepository) {
    this.repo = dashboardRepository;
  }

  // classify ages into buckets
  _bucketAges (ages) {
    return AGE_BUCKETS.map(({ label, min, max }) => {
      const total = ages.filter(age => age >= min && age <= max).length;
      return new AgeBucketEntity({ age_range: label, total });
    });
  }

  async execute () {
    const [counts, ageDistribution, gender, tests, standByList] = await Promise.all([
      this.repo.fetchCounts(),
      this.repo.fetchAgeDistribution(),
      this.repo.fetchGenderDistribution(),
      this.repo.fetchTestCounts(),
      this.repo.fetchStandByList(),
    ]);
    const age = this._bucketAges(ageDistribution);

    return new DashboardSummaryDTO({ counts, age, gender, tests, standByList });
  }
}
module.exports = GetDashboardSummaryUseCase;
