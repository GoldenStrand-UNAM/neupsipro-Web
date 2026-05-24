class userSummary {
  constructor ({ id, reference_number, full_name, state, protocol }) {
    this.id = id;
    this.referenceNumber = reference_number ?? null;
    this.fullName = full_name;
    this.state = state ?? null;
    this.protocol = protocol ?? null;
  }
}
module.exports = userSummary;
