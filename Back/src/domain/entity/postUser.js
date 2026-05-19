class User {
  constructor ({ data }) {
    this.id_role = data.idRole,
    this.user_name = data.userName,
    this.first_name = data.firstName,
    this.lastname_p = data.lastnameP,
    this.lastname_m = data.lastnameM || null,
    this.birthdate = data.birthdate,
    this.password_hash = data.passwordHash,
    this.id_clinic_user = data.assigned,
    this.neuro_status = data.phase,
    this.base_pathology = data.basePathology,
    this.attendance = data.modality,
    this.profile_photo = data.profilePhoto || null,
    this.reference_number = data.referenceNumber,
    this.amputation_date = data.amputationDate,
    this.amputation_level = data.amputationLevel,
    this.laterality = data.laterality,
    this.prosthetist = data.prosthetist,
    this.neuro_entry_date = data.neuroEntryDate,
    this.group_intervention = data.pairs,
    this.gender = data.sex
  }
}

module.exports = User;