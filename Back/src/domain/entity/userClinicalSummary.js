class userClinicalSummary {
  constructor ({ id, full_name, affiliation, activity, assigned_count }) {
    this.id = id;
    this.fullName = full_name;
    this.affiliation = affiliation;
    this.activity = activity;
    this.assignedCount = Number(assigned_count) || 0;
  }
}
module.exports = userClinicalSummary;
