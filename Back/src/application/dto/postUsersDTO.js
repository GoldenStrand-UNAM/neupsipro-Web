class UsersDTO {
  constructor (user) {
    this.idRole = user.idRole;
    this.userName = user.userName;
    this.firstName = user.firstName;
    this.lastnameP = user.lastnameP;
    this.lastnameM = user.lastnameM;
    this.birthdate = user.birthdate;
    this.assigned = user.assigned;
    this.phase = user.phase;
    this.basePathology = user.basePathology;
    this.modality = user.modality;
    this.profilePhoto = user.profilePhoto;
    this.referenceNumber = user.referenceNumber;
    this.laterality = user.laterality;
    this.prosthetist = user.prosthetist;
    this.neuroEntryDate = user.neuroEntryDate;
    this.amputationDate = user.amputationDate;
    this.amputationLevel = user.amputationLevel;
    this.pairs = user.pairs;
    this.sex = user.sex;
  } static fromEntity (entity) {
    return new UsersDTO ({
      idRole: entity.id_role,
      userName: entity.user_name,
      firstName: entity.first_name,
      lastnameP: entity.lastname_p,
      lastnameM: entity.lastname_m,
      birthdate: entity.birthdate,
      assigned: entity.id_clinic_user,
      phase: entity.neuro_status,
      basePathology: entity.base_patology,
      modality: entity.attendance,
      profilePhoto: entity.profile_photo,
      referenceNumber: entity.reference_number,
      laterality: entity.laterality,
      prosthetist: entity.prosthetist,
      neuroEntryDate: entity.neuro_entry_date,
      amputationDate: entity.amputation_date,
      amputationLevel: entity.amputation_level,
      pairs: entity.group_intervention,
      sex: entity.gender,
    });
  }
}
module.exports = UsersDTO;
