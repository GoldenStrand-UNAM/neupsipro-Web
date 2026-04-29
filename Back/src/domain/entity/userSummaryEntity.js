class userSummary {
    constructor ({ id, reference_number, full_name, neuro_status, protocol }) { 
        this.id = id;
        this.referenceNumber = reference_number ?? null;
        this.fullName = full_name;
        this.neuroStatus = neuro_status ?? null;
        this.protocol = protocol ?? null;
    }
}
module.exports = userSummary;