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

  _calculateAge (birthdate) {
    if (!birthdate) return null;

    let d;
    if (typeof birthdate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(birthdate)) {
      const [day, month, year] = birthdate.split('/').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(birthdate);
    }
    if (isNaN(d.getTime())) return null;

    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
      age -= 1;
    }
    return age;
  }

  // classify ages into buckets
  _bucketAges (ages) {
    return AGE_BUCKETS.map(({ label, min, max }) => {
      const total = ages.filter(age => age >= min && age <= max).length;
      return new AgeBucketEntity({ age_range: label, total });
    });
  }

  async execute () {
    const [counts, birthdates, gender, tests, standByList] = await Promise.all([
      this.repo.fetchCounts(),
      this.repo.fetchAgeDistribution(),
      this.repo.fetchGenderDistribution(),
      this.repo.fetchTestCounts(),
      this.repo.fetchStandByList(),
    ]);

    // Convert raw birthdates into ages, discarding malformed ones, then bucket them.
    const ages = birthdates
      .map(b => this._calculateAge(b))
      .filter(age => age !== null);
    const age = this._bucketAges(ages);

    return new DashboardSummaryDTO({ counts, age, gender, tests, standByList });
  }
}
module.exports = GetDashboardSummaryUseCase;
