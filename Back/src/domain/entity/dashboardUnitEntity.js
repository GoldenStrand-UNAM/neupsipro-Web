class DashboardCountsEntity {
  constructor (row = {}) {
    this.discharged = Number(row.discharged) || 0;
    this.inIntervention = Number(row.in_intervention) || 0;
    this.standBy  = Number(row.stand_by) || 0;
    this.clinical  = Number(row.clinical) || 0;
    this.research  = Number(row.research) || 0;
    this.noProtocol = Number(row.no_protocol) || 0;
  }
}

class AgeBucketEntity {
  constructor (row) {
    this.range = row.age_range;
    this.total = Number(row.total) || 0;
  }
}

class GenderBucketEntity {
  constructor (row) {
    this.gender = row.gender;
    this.total  = Number(row.total) || 0;
  }
}

class TestCountEntity {
  constructor (row) {
    this.idTest   = row.id_test;
    this.testName = row.test_name;
    this.protocol = row.protocol || null; 
    this.total    = Number(row.total) || 0;
  }
}

class StandByDetailEntity {
  constructor (row) {
    this.idUser          = row.id_user;
    this.referenceNumber = row.reference_number;
    this.fullName        = row.full_name;
    this.birthdate       = row.birthdate;
    this.profilePhoto = row.profile_photo;
    this.schooling       = row.schooling;
    this.unitEntryDate   = row.registration_date;
    this.neuroEntryDate  = row.neuro_entry_date;
    this.amputationDate  = row.amputation_date;
    this.protocol        = row.protocol;
    this.assignedClinics = row.assigned_clinics
      ? row.assigned_clinics.split('|').filter(Boolean) : [];
  }
}

module.exports = {
  DashboardCountsEntity,
  AgeBucketEntity,
  GenderBucketEntity,
  TestCountEntity,
  StandByDetailEntity,
};
