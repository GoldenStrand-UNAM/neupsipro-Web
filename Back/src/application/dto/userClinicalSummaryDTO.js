class UserClinicalSummaryDTO {
  constructor (userSummary) {
    this.id = userSummary.id;
    this.fullName = userSummary.fullName;
    this.affiliation = userSummary.affiliation;
    this.activity = userSummary.activity;
    this.assignedCount = userSummary.assignedCount;
  }
}
module.exports = UserClinicalSummaryDTO;
