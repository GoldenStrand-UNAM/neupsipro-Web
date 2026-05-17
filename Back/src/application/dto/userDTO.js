class UserDTO {
  constructor ({
    idUser,
    photo,
    referenceNumber,
    name,
    age,
    registrationDate,
    phase,
    assignedClinic,
    modality,
    attendance,
    amputationDate,
    protocol,
    state,
    groupIntervention,
    amputationEtiology,
    laterality,
    prosthetist,
    neuroEntryDate,
    amputationLevel,
    nextAppointment,
    initialInterview,
  }) {
    this.idUser = idUser;
    this.photo = photo;
    this.referenceNumber = referenceNumber;
    this.name = name;
    this.age = age;
    this.registrationDate = registrationDate;
    this.phase = phase;

    this.assignedClinic = assignedClinic;
    this.modality = modality;
    this.attendance = attendance;
    this.amputationDate = amputationDate;
    this.protocol = protocol;
    this.state = state;
    this.groupIntervention = groupIntervention;
    this.amputationEtiology = amputationEtiology;
    this.laterality = laterality;
    this.prosthetist = prosthetist;
    this.neuroEntryDate = neuroEntryDate;
    this.amputationLevel = amputationLevel;
    this.nextAppointment = nextAppointment;

    this.initialInterview = initialInterview;
  }

  static fromEntity (entity) {
    return new UserDTO({
      idUser: entity.idUser,
      photo: entity.photo,
      referenceNumber: entity.referenceNumber,
      name: entity.name,
      age: entity.age,
      registrationDate: entity.registrationDate,
      phase: entity.phase,

      assignedClinic: entity.assignedClinic,
      modality: entity.modality,
      attendance: entity.attendance,
      amputationDate: entity.amputationDate,
      protocol: entity.protocol,
      state: entity.state,
      groupIntervention: entity.groupIntervention,
      amputationEtiology: entity.amputationEtiology,
      laterality: entity.laterality,
      prosthetist: entity.prosthetist,
      neuroEntryDate: entity.neuroEntryDate,
      amputationLevel: entity.amputationLevel,
      nextAppointment: entity.nextAppointment,

      initialInterview: entity.initialInterview,
    });
  }
}

module.exports = UserDTO;
