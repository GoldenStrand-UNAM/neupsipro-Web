class userSummaryEntity {
    constructor({ id_user, user_name, lastname_p, lastname_m, neuro_status, initial_interview }) {
        this.id_user = id_user;
        this.user_name = user_name;
        this.lastname_p = lastname_p;
        this.lastname_m = lastname_m;
        this.neuro_status = neuro_status ?? null;
        this.initial_interview = !!initial_interview;
    }
 
    get fullName() {
        return `${this.user_name} ${this.lastname_p} ${this.lastname_m}`.trim();
    }
}
 
module.exports = userSummaryEntity;
 