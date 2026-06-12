// DTO that maps dashboard users status info
class DashboardStatusDTO {
  constructor (entity) {
    this.discharged = entity.discharged;
    this.inIntervention = entity.inIntervention;
    this.standBy = entity.standBy;
    this.clinical = entity.clinical;
    this.research = entity.research;
    this.noProtocol = entity.noProtocol;
  }
}

//Creates age distribution labels and values from range totals
class DashboardAgesDTO {
  constructor (RangeTotals) {
    this.labels = RangeTotals.map(b => b.range);
    this.data = RangeTotals.map(b => b.total);
  }
}

// Creates gender distribution data with percentages
class DashboardGenderDTO {
  constructor (GendetTotals) {
    const total = GendetTotals.reduce((a, b) => a + b.total, 0) || 1;
    this.items = GendetTotals.map(b => ({
      gender: b.gender,
      total: b.total,
      percentage: Math.round((b.total / total) * 100),
    }));
  }
}

class DashboardTestCountsDTO {
  constructor (entities) {
    const research = entities.filter(e => e.protocol === 'Research');
    const clinical = entities.filter(e => e.protocol === 'Clinical');

    const mapItems = list => list.map(e => ({
      idTest: e.idTest,
      testName: e.testName,
      total: e.total,
    }));

    const sumTotal = list => list.reduce((a, e) => a + e.total, 0);

    this.research = {
      items: mapItems(research),
      totalProtocols: sumTotal(research),
    };

    this.clinical = {
      items: mapItems(clinical),
      totalProtocols: sumTotal(clinical),
    };

    this.totalProtocols = this.research.totalProtocols + this.clinical.totalProtocols;
  }
}

// DTO that takes detailed information for standBy patients for the ajax
class DashboardStandByDetailDTO {
  constructor (entity) {
    if (!entity) {
      this.found = false;
      return;
    }
    this.found = true;
    this.idUser = entity.idUser;
    this.referenceNumber = entity.referenceNumber;
    this.fullName = entity.fullName;
    this.photo = entity.profilePhoto || null;
    this.age = DashboardStandByDetailDTO._calculateAge(entity.birthdate);
    this.schooling = entity.schooling || null;
    this.unitEntryDate = DashboardStandByDetailDTO._formatDate(entity.unitEntryDate);
    this.neuroEntryDate = DashboardStandByDetailDTO._formatDate(entity.neuroEntryDate);
    this.amputationDate = DashboardStandByDetailDTO._formatDate(entity.amputationDate);
    this.protocol = entity.protocol;
    this.assignedClinics = entity.assignedClinics || [];
  }

  static _calculateAge (birthdate) {
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
    let years = now.getFullYear() - d.getFullYear();
    let months = now.getMonth() - d.getMonth();
    let days  = now.getDate() - d.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }

  //DD/MM/YYYY format
  static _formatDate (rawDate) {
    if (!rawDate) return null;
    let date;
    if (typeof rawDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
      const [day, month, year] = rawDate.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(rawDate);
    }
    if (isNaN(date.getTime())) return null;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}

//  DTO that groups all dashboard summary information
class DashboardSummaryDTO {
  constructor ({ counts, age, gender, tests, standByList }) {
    this.counts = new DashboardStatusDTO(counts);
    this.ageDistribution = new DashboardAgesDTO(age);
    this.genderDistribution = new DashboardGenderDTO(gender);
    this.testCounts = new DashboardTestCountsDTO(tests);
    this.standByList = standByList;
  }
}

module.exports = {
  DashboardStatusDTO,
  DashboardAgesDTO,
  DashboardGenderDTO,
  DashboardTestCountsDTO,
  DashboardStandByDetailDTO,
  DashboardSummaryDTO,
};
