const { DashboardSummaryDTO } = require('../../dto/dashboardUnitDTO');
const { AgeBucketEntity, GenderBucketEntity } = require('../../../domain/entity/dashboardUnitEntity');

// Ages buckets for the age distribution
const AGE_BUCKETS = [
  { label: '0-10',  min: 0,   max: 10  },
  { label: '11-17', min: 11,  max: 17  },
  { label: '18-29', min: 18,  max: 29  },
  { label: '30-39', min: 30,  max: 39  },
  { label: '40-49', min: 40,  max: 49  },
  { label: '50-59', min: 50,  max: 59  },
  { label: '60-69', min: 60,  max: 69  },
  { label: '70-79', min: 70,  max: 79  },
  { label: '80+',   min: 80,  max: Infinity },
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

  // Classify and count genders into buckets
  _groupGenders (gendersList) {
    const counts = gendersList.reduce((acc, gender) => {
      const g = gender || 'Not specified';
      // eslint-disable-next-line security/detect-object-injection, no-param-reassign
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => new GenderBucketEntity({ gender: key, total: counts[key] }));
  }

  async execute () {
    const [counts, birthdates, rawGenders, tests, standByList] = await Promise.all([
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

    const gender = this._groupGenders(rawGenders);

    return new DashboardSummaryDTO({ counts, age, gender, tests, standByList });
  }
}
module.exports = GetDashboardSummaryUseCase;
