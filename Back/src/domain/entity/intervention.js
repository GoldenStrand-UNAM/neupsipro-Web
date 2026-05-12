class Intervention {
  constructor (data) {
    this.idIntervention = data.id_intervention;
    this.idUser = data.id_user;
    this.neuropsychProfile = data.neuropsych_profile;
    this.contractLink = data.contract_link;
  }
}
module.exports = Intervention;