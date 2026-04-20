class userSummary {
    constructor ({ reference_number, full_name, id }) {
        this.id = id;
        this.referenceNumber = reference_number;
        this.fullName = full_name;
    }
}
module.exports = userSummary;