class UserClinicalSummaryDTO {
    constructor (userSummary) {
        this.id = userSummary.id;
        this.fullName = userSummary.fullName;
    }
}
module.exports = UserClinicalSummaryDTO;