class Intervention {
  constructor (data) {
    this.idIntervention   = data.id_intervention;
    this.idUser           = data.id_user;
    this.contractLink     = data.contract_link;
    this.createdAt        = data.created_at;
    this.userFullName     = data.user_full_name || null;
    this.referenceNumber  = data.reference_number || null;
    this.photo            = data.profile_photo || null;
    this.schooling        = data.schooling || null;
    this.ocupation        = data.ocupation || null;
  }
}
module.exports = Intervention;