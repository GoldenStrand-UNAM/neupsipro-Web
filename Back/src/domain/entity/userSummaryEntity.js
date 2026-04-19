class userSummary {
    constructor ({ folio, full_name, id }) {
        this.id = id;
        this.folio    = folio;
        this.fullName = full_name;
    }
}
module.exports = userSummary;