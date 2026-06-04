class userSummary {
  constructor ({ id, reference_number, first_name, lastname_p, lastname_m, state, protocol }) {
    this.id = id;
    this.referenceNumber = reference_number ?? null;
    this.firstName = first_name;
    this.lastNameP = lastname_p;
    this.lastNameM = lastname_m ?? null;
    this.state = state ?? null;
    this.protocol = protocol ?? null;
  }
}
module.exports = userSummary;
