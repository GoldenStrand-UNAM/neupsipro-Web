class UserDTO {
  constructor ({
    idUser,
    photo,
    referenceNumber,
    name,
    email,
    age,
    registrationDate,
    phase,
    assignedClinic,
    modality,
    attendance,
    amputationDate,
    protocol,
    phone,
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
    this.email = email;
    this.age = age;
    this.registrationDate = registrationDate;
    this.phase = phase;

    this.assignedClinic = assignedClinic;
    this.modality = modality;
    this.attendance = attendance;
    this.amputationDate = amputationDate;
    this.protocol = protocol;
    this.phone = phone;
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
      email: entity.email,
      age: entity.age,
      registrationDate: entity.registrationDate,
      phase: entity.phase,

      assignedClinic: entity.assignedClinic,
      modality: entity.modality,
      attendance: entity.attendance,
      amputationDate: entity.amputationDate,
      protocol: entity.protocol,
      phone: entity.phone,
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
